import { NextResponse } from "next/server";
import { db, withDbRetry } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = user.organizationId;

    // Run optimized queries wrapped in withDbRetry to prevent connection starvation
    const [
      severityGroups,
      incidentGroups,
      brandAssetsCount,
      recentAnalyses,
      signalsGrouped,
      intelMatchesCount,
    ] = await Promise.all([
      // 1. Group analyses by severity to get totals + all severities in 1 query
      withDbRetry(() =>
        db.analysis.groupBy({
          by: ["severity"],
          where: { organizationId: orgId },
          _count: { _all: true },
        })
      ).catch((err) => {
        console.warn("Analysis severity groupBy error:", err.message);
        return [];
      }),

      // 2. Group incidents by status to get total, open, and resolved in 1 query
      withDbRetry(() =>
        db.incident.groupBy({
          by: ["status"],
          where: { organizationId: orgId },
          _count: { _all: true },
        })
      ).catch((err) => {
        console.warn("Incident groupBy error:", err.message);
        return [];
      }),

      // 3. Count protected brand assets
      withDbRetry(() =>
        db.brandAsset.count({ where: { organizationId: orgId } })
      ).catch((err) => {
        console.warn("BrandAsset count error:", err.message);
        return 0;
      }),

      // 4. Fetch recent 6 analyses with relation data
      withDbRetry(() =>
        db.analysis.findMany({
          where: { organizationId: orgId },
          orderBy: { createdAt: "desc" },
          take: 6,
          include: {
            signals: { select: { title: true, weight: true } },
            brandSimilarities: { select: { brandName: true, matchType: true } },
          },
        })
      ).catch((err) => {
        console.warn("Recent analyses fetch error:", err.message);
        return [];
      }),

      // 5. Group detection signals by category
      withDbRetry(() =>
        db.detectionSignal.groupBy({
          by: ["category"],
          where: { analysis: { organizationId: orgId } },
          _count: { _all: true },
        })
      ).catch((err) => {
        console.warn("Signal category groupBy error:", err.message);
        return [];
      }),

      // 6. Threat intelligence matches
      withDbRetry(() =>
        db.analysis.count({
          where: { organizationId: orgId, intelligenceStatus: "MATCH_FOUND" },
        })
      ).catch(() => 0),
    ]);

    // Map severity groups and compute total analyses
    let totalAnalyses = 0;
    const severityMap: Record<string, number> = {};
    if (Array.isArray(severityGroups)) {
      for (const item of severityGroups) {
        const count = item._count?._all || 0;
        severityMap[item.severity] = count;
        totalAnalyses += count;
      }
    }

    const criticalFindings = severityMap["CRITICAL"] || 0;
    const highFindings = severityMap["HIGH"] || 0;
    const mediumFindings = severityMap["MEDIUM"] || 0;
    const lowFindings = (severityMap["LOW"] || 0) + (severityMap["INFO"] || 0);

    // Map incident groups
    let totalIncidents = 0;
    let openIncidents = 0;
    let resolvedIncidents = 0;
    if (Array.isArray(incidentGroups)) {
      for (const item of incidentGroups) {
        const count = item._count?._all || 0;
        totalIncidents += count;
        if (["NEW", "INVESTIGATING", "ESCALATED"].includes(item.status)) {
          openIncidents += count;
        } else if (["RESOLVED", "FALSE_POSITIVE"].includes(item.status)) {
          resolvedIncidents += count;
        }
      }
    }

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
        threatIntelMatches: intelMatchesCount,
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
