import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = user.organizationId;

    // Run parallel aggregation queries on actual database records
    const [
      totalAnalyses,
      threatIntelMatches,
      criticalFindings,
      highFindings,
      mediumFindings,
      lowFindings,
      totalIncidents,
      openIncidents,
      resolvedIncidents,
      brandAssetsCount,
      recentAnalyses,
      signalsGrouped,
    ] = await Promise.all([
      db.analysis.count({ where: { organizationId: orgId } }),
      db.analysis.count({
        where: { organizationId: orgId, intelligenceStatus: "MATCH_FOUND" },
      }),
      db.analysis.count({ where: { organizationId: orgId, severity: "CRITICAL" } }),
      db.analysis.count({ where: { organizationId: orgId, severity: "HIGH" } }),
      db.analysis.count({ where: { organizationId: orgId, severity: "MEDIUM" } }),
      db.analysis.count({ where: { organizationId: orgId, severity: "LOW" } }),
      db.incident.count({ where: { organizationId: orgId } }),
      db.incident.count({
        where: {
          organizationId: orgId,
          status: { in: ["NEW", "INVESTIGATING", "ESCALATED"] },
        },
      }),
      db.incident.count({
        where: {
          organizationId: orgId,
          status: { in: ["RESOLVED", "FALSE_POSITIVE"] },
        },
      }),
      db.brandAsset.count({ where: { organizationId: orgId } }),
      db.analysis.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          signals: { select: { title: true, weight: true } },
          brandSimilarities: { select: { brandName: true, matchType: true } },
        },
      }),
      db.detectionSignal.groupBy({
        by: ["category"],
        where: { analysis: { organizationId: orgId } },
        _count: { _all: true },
      }),
    ]);

    // Risk Distribution for Charts
    const riskDistribution = [
      { name: "Critical (70-100)", count: criticalFindings, color: "#ef4444" },
      { name: "High (40-69)", count: highFindings, color: "#f97316" },
      { name: "Medium (20-39)", count: mediumFindings, color: "#f59e0b" },
      { name: "Low (0-19)", count: lowFindings, color: "#3b82f6" },
    ];

    // Signal Category Breakdown
    const categoryStats = signalsGrouped.map((s) => ({
      category: s.category.replace(/_/g, " "),
      count: s._count._all,
    }));

    return NextResponse.json({
      metrics: {
        totalAnalyses,
        threatIntelMatches,
        criticalFindings,
        highFindings,
        mediumFindings,
        lowFindings,
        totalIncidents,
        openIncidents,
        resolvedIncidents,
        brandAssetsCount,
      },
      riskDistribution,
      categoryStats,
      recentAnalyses,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to generate dashboard statistics" }, { status: 500 });
  }
}
