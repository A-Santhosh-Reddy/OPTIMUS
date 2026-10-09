import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit/logger";

const GenerateReportSchema = z.object({
  analysisId: z.string().min(1, "Analysis ID is required"),
  incidentId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = GenerateReportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
    }

    const { analysisId, incidentId } = parsed.data;

    const analysis = await db.analysis.findFirst({
      where: { id: analysisId, organizationId: user.organizationId },
      include: {
        signals: true,
        brandSimilarities: true,
        intelResults: true,
      },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis record not found" }, { status: 404 });
    }

    let incident = null;
    if (incidentId) {
      incident = await db.incident.findFirst({
        where: { id: incidentId, organizationId: user.organizationId },
        include: {
          assignedUser: { select: { name: true, email: true } },
          notes: { orderBy: { createdAt: "desc" } },
        },
      });
    }

    const reportData = {
      reportId: `RPT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      generatedBy: `${user.name} (${user.email} - ${user.role})`,
      organizationName: user.organizationName || "Security Operations",
      analysis: {
        id: analysis.id,
        submittedUrl: analysis.submittedUrl,
        normalizedHostname: analysis.normalizedHostname,
        registrableDomain: analysis.registrableDomain,
        riskScore: analysis.riskScore,
        severity: analysis.severity,
        heuristicScore: analysis.heuristicScore,
        intelligenceStatus: analysis.intelligenceStatus,
        createdAt: analysis.createdAt.toISOString(),
        aiExplanation: analysis.aiExplanation || undefined,
        limitations: JSON.parse(analysis.limitations || "[]"),
        signals: analysis.signals,
        brandSimilarities: analysis.brandSimilarities,
        intelResults: analysis.intelResults,
      },
      incident: incident
        ? {
            id: incident.id,
            title: incident.title,
            description: incident.description,
            status: incident.status,
            severity: incident.severity,
            assignedUser: incident.assignedUser || undefined,
            analystConclusion: incident.analystConclusion || undefined,
            notes: incident.notes.map((n) => ({
              authorName: n.authorName,
              content: n.content,
              createdAt: n.createdAt.toISOString(),
            })),
          }
        : undefined,
    };

    await logAuditEvent({
      organizationId: user.organizationId,
      actorId: user.id,
      actorEmail: user.email,
      action: "REPORT_GENERATED",
      resourceType: "Report",
      resourceId: reportData.reportId,
      metadata: { analysisId, target: analysis.normalizedHostname },
    });

    return NextResponse.json({ success: true, report: reportData });
  } catch (error: any) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
