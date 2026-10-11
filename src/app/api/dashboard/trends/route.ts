import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d

    // Calculate date range
    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orgId = user.organizationId;

    // 1. Severity distribution over time
    const analyses = await db.analysis.findMany({
      where: {
        organizationId: orgId,
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        riskScore: true,
        severity: true,
        normalizedHostname: true,
        registrableDomain: true,
        createdAt: true,
        signals: {
          select: {
            signalType: true,
            category: true,
          },
        },
        brandSimilarities: {
          select: {
            brandName: true,
            matchType: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // 2. Daily analysis volume & severity breakdown
    const dailyBreakdown: Record<string, { date: string; critical: number; high: number; medium: number; low: number; total: number }> = {};

    for (const a of analyses) {
      const dateKey = a.createdAt.toISOString().split("T")[0];
      if (!dailyBreakdown[dateKey]) {
        dailyBreakdown[dateKey] = { date: dateKey, critical: 0, high: 0, medium: 0, low: 0, total: 0 };
      }
      dailyBreakdown[dateKey].total++;
      if (a.severity === "CRITICAL") dailyBreakdown[dateKey].critical++;
      else if (a.severity === "HIGH") dailyBreakdown[dateKey].high++;
      else if (a.severity === "MEDIUM") dailyBreakdown[dateKey].medium++;
      else dailyBreakdown[dateKey].low++;
    }

    // 3. Brand attack frequency
    const brandAttackCounts: Record<string, number> = {};
    for (const a of analyses) {
      for (const bs of a.brandSimilarities) {
        if (bs.matchType !== "EXACT_OFFICIAL") {
          brandAttackCounts[bs.brandName] = (brandAttackCounts[bs.brandName] || 0) + 1;
        }
      }
    }
    const topTargetedBrands = Object.entries(brandAttackCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ brandName: name, attackCount: count }));

    // 4. TLD abuse ranking
    const tldCounts: Record<string, { total: number; malicious: number }> = {};
    for (const a of analyses) {
      const parts = a.registrableDomain.split(".");
      const tld = parts[parts.length - 1];
      if (!tldCounts[tld]) tldCounts[tld] = { total: 0, malicious: 0 };
      tldCounts[tld].total++;
      if (a.riskScore >= 40) tldCounts[tld].malicious++;
    }
    const tldAbuse = Object.entries(tldCounts)
      .filter(([, v]) => v.malicious > 0)
      .sort(([, a], [, b]) => b.malicious - a.malicious)
      .slice(0, 15)
      .map(([tld, counts]) => ({
        tld: `.${tld}`,
        totalAnalyses: counts.total,
        maliciousCount: counts.malicious,
        abuseRate: Math.round((counts.malicious / counts.total) * 100),
      }));

    // 5. Signal type frequency
    const signalCounts: Record<string, number> = {};
    for (const a of analyses) {
      for (const sig of a.signals) {
        signalCounts[sig.signalType] = (signalCounts[sig.signalType] || 0) + 1;
      }
    }
    const topSignals = Object.entries(signalCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([type, count]) => ({ signalType: type, count }));

    // 6. Hour-of-day distribution
    const hourlyDistribution: number[] = new Array(24).fill(0);
    for (const a of analyses) {
      const hour = a.createdAt.getHours();
      hourlyDistribution[hour]++;
    }

    // 7. Severity summary totals
    const severitySummary = {
      critical: analyses.filter((a) => a.severity === "CRITICAL").length,
      high: analyses.filter((a) => a.severity === "HIGH").length,
      medium: analyses.filter((a) => a.severity === "MEDIUM").length,
      low: analyses.filter((a) => a.severity === "LOW" || a.severity === "INFO").length,
      total: analyses.length,
    };

    // 8. Average risk score
    const avgRiskScore = analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.riskScore, 0) / analyses.length)
      : 0;

    return NextResponse.json({
      success: true,
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
      },
      severitySummary,
      avgRiskScore,
      dailyBreakdown: Object.values(dailyBreakdown),
      topTargetedBrands,
      tldAbuse,
      topSignals,
      hourlyDistribution: hourlyDistribution.map((count, hour) => ({ hour, count })),
    });
  } catch (error: any) {
    console.error("Trends API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
