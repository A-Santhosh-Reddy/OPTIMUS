import { NextResponse } from "next/server";
import { z } from "zod";
import { db, withDbRetry } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { runCompleteThreatAnalysis } from "@/lib/detection/engine";
import { logAuditEvent } from "@/lib/audit/logger";
import { dispatchAlerts } from "@/lib/alerts/alert-engine";

const AnalyzeRequestSchema = z.object({
  url: z.string().min(1, "URL or domain name is required").max(2000, "URL exceeds maximum supported length"),
});

const DEFAULT_BRANDS = [
  { brandName: "Microsoft", officialDomain: "microsoft.com", aliases: ["office.com", "azure.com", "live.com"] },
  { brandName: "PayPal", officialDomain: "paypal.com", aliases: ["paypal-objects.com", "paypal-communication.com"] },
  { brandName: "Apple", officialDomain: "apple.com", aliases: ["icloud.com", "appleid.apple.com"] },
  { brandName: "Bank of America", officialDomain: "bankofamerica.com", aliases: ["bofa.com", "bankofamerica.net"] },
  { brandName: "Google", officialDomain: "google.com", aliases: ["gmail.com", "google.co.uk"] },
];

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to submit assets for threat analysis" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid URL submission", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { url } = parsed.data;

    // Retrieve active protected brand assets for the organization (with resilient fallback)
    let formattedBrands = DEFAULT_BRANDS;
    try {
      const orgBrands = await withDbRetry(() =>
        db.brandAsset.findMany({
          where: {
            organizationId: user.organizationId,
            isActive: true,
          },
        })
      );

      if (orgBrands && orgBrands.length > 0) {
        formattedBrands = orgBrands.map((b) => {
          let aliases: string[] = [];
          try {
            aliases = b.aliases ? JSON.parse(b.aliases) : [];
          } catch {}
          return {
            brandName: b.brandName,
            officialDomain: b.officialDomain,
            aliases,
          };
        });
      }
    } catch (brandErr: any) {
      console.warn("Could not load organization brands from DB, using defaults:", brandErr.message);
    }

    // Execute complete multi-layer threat analysis
    const report = await runCompleteThreatAnalysis(url, formattedBrands);

    if (!report.isValid) {
      return NextResponse.json(
        { error: report.errorMessage || "Failed to parse submitted URL" },
        { status: 400 }
      );
    }

    // Persist Analysis Record and sub-records in Database (with resilient retry and fallback)
    let savedAnalysis: any = null;
    try {
      savedAnalysis = await withDbRetry(() =>
        db.analysis.create({
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
          include: {
            signals: true,
            brandSimilarities: true,
            intelResults: true,
          },
        })
      );

      // Write audit event asynchronously
      logAuditEvent({
        organizationId: user.organizationId,
        actorId: user.id,
        actorEmail: user.email,
        action: "URL_ANALYZED",
        resourceType: "Analysis",
        resourceId: savedAnalysis.id,
        metadata: {
          hostname: report.normalizedHostname,
          score: report.riskScore.finalScore,
          severity: report.riskScore.severity,
        },
      }).catch((e) => console.warn("Audit logging deferred:", e.message));

      // Dispatch alert notifications asynchronously
      dispatchAlerts(
        savedAnalysis.id,
        report.riskScore.severity,
        report.riskScore.finalScore,
        report.normalizedHostname,
        report.submittedUrl,
        report.signals.length,
        report.signals.slice(0, 5).map((s) => s.title),
        report.brandMatches.map((bm) => bm.brandName),
        report.overallIntelStatus,
        report.aiExplanation.summary
      ).catch((err) => console.warn("Alert dispatch deferred:", err.message));
    } catch (saveError: any) {
      console.warn("Database persistence failed, returning live analysis directly:", saveError.message);
      // Real-time analysis fallback ensures the user receives full detection results without interruption
      savedAnalysis = {
        id: "live-" + Date.now(),
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
        createdAt: new Date().toISOString(),
        signals: report.signals,
        brandSimilarities: report.brandMatches,
        intelResults: report.intelResults,
      };
    }

    return NextResponse.json({
      success: true,
      analysis: savedAnalysis,
      report,
    });
  } catch (error: any) {
    console.error("Threat analysis endpoint error:", error);
    return NextResponse.json(
      { error: "Analysis parsing error: " + (error?.message || "Please check submitted URL format") },
      { status: 500 }
    );
  }
}
