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

    // Run parallel queries with safe fallback per query to prevent connection starvation
    const [
      totalAnalyses,
      threatIntelMatches,
      severityGroups,
      totalIncidents,
      openIncidents,
      resolvedIncidents,
      brandAssetsCount,
      recentAnalyses,
      signalsGrouped,
    ] = await Promise.all([
      db.analysis.count({ where: { organizationId: orgId } }).catch((err) => {
        console.warn("Analysis count error:", err.message);
        return 0;
      }),
      db.analysis.count({
        where: { organizationId: orgId, intelligenceStatus: "MATCH_FOUND" },
      }).catch(() => 0),
      db.analysis.groupBy({
        by: ["severity"],
        where: { organizationId: orgId },
        _count: { _all: true },
      }).catch(() => []),
      db.incident.count({ where: { organizationId: orgId } }).catch(() => 0),
      db.incident.count({
        where: {
          organizationId: orgId,
          status: { in: ["NEW", "INVESTIGATING", "ESCALATED"] },
        },
      }).catch(() => 0),
      db.incident.count({
        where: {
          organizationId: orgId,
          status: { in: ["RESOLVED", "FALSE_POSITIVE"] },
        },
      }).catch(() => 0),
      db.brandAsset.count({ where: { organizationId: orgId } }).catch(() => 0),
      db.analysis.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          signals: { select: { title: true, weight: true } },
          brandSimilarities: { select: { brandName: true, matchType: true } },
        },
      }).catch(() => []),
      db.detectionSignal.groupBy({
        by: ["category"],
        where: { analysis: { organizationId: orgId } },
        _count: { _all: true },
      }).catch(() => []),
    ]);

    // Map severity groups efficiently
    const severityMap: Record<string, number> = {};
    if (Array.isArray(severityGroups)) {
      for (const item of severityGroups) {
        severityMap[item.severity] = item._count?._all || 0;
      }
    }

    const criticalFindings = severityMap["CRITICAL"] || 0;
    const highFindings = severityMap["HIGH"] || 0;
    const mediumFindings = severityMap["MEDIUM"] || 0;
    const lowFindings = severityMap["LOW"] || 0;

    // Risk Distribution for Charts
    const riskDistribution = [
      { name: "Critical (70-100)", count: criticalFindings, color: "#ef4444" },
      { name: "High (40-69)", count: highFindings, color: "#f97316" },
      { name: "Medium (20-39)", count: mediumFindings, color: "#f59e0b" },
      { name: "Low (0-19)", count: lowFindings, color: "#3b82f6" },
    ];

    // Signal Category Breakdown
    const categoryStats = Array.isArray(signalsGrouped)
      ? signalsGrouped.map((s) => ({
          category: s.category?.replace(/_/g, " ") || "Other",
          count: s._count?._all || 0,
        }))
      : [];

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
      recentAnalyses: Array.isArray(recentAnalyses) ? recentAnalyses : [],
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    // Return empty fallback structure so the dashboard never breaks
    return NextResponse.json({
      metrics: {
        totalAnalyses: 0,
        threatIntelMatches: 0,
        criticalFindings: 0,
        highFindings: 0,
        mediumFindings: 0,
        lowFindings: 0,
        totalIncidents: 0,
        openIncidents: 0,
        resolvedIncidents: 0,
        brandAssetsCount: 0,
      },
      riskDistribution: [],
      categoryStats: [],
      recentAnalyses: [],
    });
  }
}
