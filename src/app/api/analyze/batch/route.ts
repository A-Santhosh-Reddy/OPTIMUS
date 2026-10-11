import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { runCompleteThreatAnalysis } from "@/lib/detection/engine";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit/logger";

const BatchAnalyzeSchema = z.object({
  urls: z
    .array(z.string().min(1).max(2000))
    .min(1, "At least 1 URL is required")
    .max(500, "Maximum 500 URLs per batch"),
  autoEscalate: z.boolean().optional().default(false),
});

export interface BatchAnalysisItem {
  index: number;
  url: string;
  status: "SUCCESS" | "FAILED" | "INVALID";
  riskScore: number;
  severity: string;
  hostname: string;
  signalCount: number;
  brandMatchCount: number;
  intelStatus: string;
  errorMessage?: string;
  analysisId?: string;
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required for batch analysis" },
        { status: 401 }
      );
    }

    // Check role - batch scanning requires ADMIN or ANALYST
    if (user.role === "VIEWER") {
      return NextResponse.json(
        { error: "Insufficient permissions for batch analysis. ANALYST or ADMIN role required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = BatchAnalyzeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid batch submission", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { urls, autoEscalate } = parsed.data;

    // Retrieve active brand assets
    const orgBrands = await db.brandAsset.findMany({
      where: { organizationId: user.organizationId, isActive: true },
    });

    const formattedBrands = orgBrands.map((b) => {
      let aliases: string[] = [];
      try { aliases = b.aliases ? JSON.parse(b.aliases) : []; } catch {}
      return { brandName: b.brandName, officialDomain: b.officialDomain, aliases };
    });

    const results: BatchAnalysisItem[] = [];
    const summary = { total: urls.length, critical: 0, high: 0, medium: 0, low: 0, failed: 0 };

    // Process URLs concurrently in batches of 10 for performance
    const BATCH_SIZE = 10;
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map(async (url, batchIdx) => {
          const globalIdx = i + batchIdx;
          try {
            const report = await runCompleteThreatAnalysis(url, formattedBrands);

            if (!report.isValid) {
              return {
                index: globalIdx,
                url,
                status: "INVALID" as const,
                riskScore: 0,
                severity: "INFO",
                hostname: "",
                signalCount: 0,
                brandMatchCount: 0,
                intelStatus: "INCONCLUSIVE",
                errorMessage: report.errorMessage,
              };
            }

            // Persist analysis
            const savedAnalysis = await db.analysis.create({
              data: {
                organizationId: user.organizationId,
                submittedUrl: report.submittedUrl,
                normalizedHostname: report.normalizedHostname,
                registrableDomain: report.registrableDomain,
                riskScore: report.riskScore.finalScore,
                severity: report.riskScore.severity,
                heuristicScore: report.riskScore.heuristicScore,
                analysisStatus: "COMPLETED",
                intelligenceStatus: report.overallIntelStatus,
                aiExplanation: report.aiExplanation.summary,
                limitations: JSON.stringify(report.limitations),
                signals: {
                  create: report.signals.map((s) => ({
                    signalType: s.signalType,
                    category: s.category,
                    title: s.title,
                    description: s.description,
                    evidence: s.evidence,
                    weight: s.weight,
                    confidence: s.confidence,
                  })),
                },
                brandSimilarities: {
                  create: report.brandMatches.map((bm) => ({
                    brandName: bm.brandName,
                    officialDomain: bm.officialDomain,
                    similarityScore: bm.similarityScore,
                    matchType: bm.matchType,
                    details: bm.details,
                  })),
                },
                intelResults: {
                  create: report.intelResults.map((intel) => ({
                    provider: intel.provider,
                    status: intel.status,
                    matchDetails: intel.matchDetails || null,
                    rawResponse: intel.rawResponse || null,
                    errorDetails: intel.errorDetails || null,
                  })),
                },
              },
            });

            // Auto-escalate critical findings to incidents
            if (autoEscalate && report.riskScore.finalScore >= 70) {
              await db.incident.create({
                data: {
                  organizationId: user.organizationId,
                  analysisId: savedAnalysis.id,
                  title: `[AUTO] Critical threat: ${report.normalizedHostname}`,
                  description: `Auto-escalated from batch scan. Risk score: ${report.riskScore.finalScore}/100. ${report.aiExplanation.summary}`,
                  severity: report.riskScore.severity,
                  status: "NEW",
                },
              });
            }

            // Update summary counts
            if (report.riskScore.severity === "CRITICAL") summary.critical++;
            else if (report.riskScore.severity === "HIGH") summary.high++;
            else if (report.riskScore.severity === "MEDIUM") summary.medium++;
            else summary.low++;

            return {
              index: globalIdx,
              url,
              status: "SUCCESS" as const,
              riskScore: report.riskScore.finalScore,
              severity: report.riskScore.severity,
              hostname: report.normalizedHostname,
              signalCount: report.signals.length,
              brandMatchCount: report.brandMatches.length,
              intelStatus: report.overallIntelStatus,
              analysisId: savedAnalysis.id,
            };
          } catch (err: any) {
            summary.failed++;
            return {
              index: globalIdx,
              url,
              status: "FAILED" as const,
              riskScore: 0,
              severity: "INFO",
              hostname: "",
              signalCount: 0,
              brandMatchCount: 0,
              intelStatus: "UNAVAILABLE",
              errorMessage: err.message || "Analysis failed",
            };
          }
        })
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          results.push(result.value);
        }
      }
    }

    // Write audit event for batch scan
    await logAuditEvent({
      organizationId: user.organizationId,
      actorId: user.id,
      actorEmail: user.email,
      action: "BATCH_URL_ANALYZED",
      resourceType: "BatchAnalysis",
      metadata: {
        totalUrls: urls.length,
        ...summary,
      },
    });

    return NextResponse.json({
      success: true,
      summary,
      results,
    });
  } catch (error: any) {
    console.error("Batch analysis endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error during batch analysis processing" },
      { status: 500 }
    );
  }
}
