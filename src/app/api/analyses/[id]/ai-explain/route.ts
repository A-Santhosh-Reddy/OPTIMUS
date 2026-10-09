import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { generateThreatExplanation } from "@/lib/ai/threat-explainer";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await db.analysis.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId,
      },
      include: {
        signals: true,
        brandSimilarities: true,
        intelResults: true,
      },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    const hasConfirmedThreat = analysis.intelResults.some(
      (i) => i.status === "MATCH_FOUND"
    );

    const explanation = await generateThreatExplanation({
      submittedUrl: analysis.submittedUrl,
      hostname: analysis.normalizedHostname,
      riskScore: {
        heuristicScore: analysis.heuristicScore,
        threatIntelBoost: 0,
        finalScore: analysis.riskScore,
        severity: analysis.severity as any,
        category: analysis.severity as any,
        contributions: [],
        isKnownThreat: hasConfirmedThreat,
      },
      signals: analysis.signals.map((s) => ({
        signalType: s.signalType,
        category: s.category as any,
        title: s.title,
        description: s.description,
        evidence: s.evidence,
        weight: s.weight,
        confidence: s.confidence as any,
      })),
      brandMatches: analysis.brandSimilarities.map((bm) => ({
        brandName: bm.brandName,
        officialDomain: bm.officialDomain,
        similarityScore: bm.similarityScore,
        matchType: bm.matchType as any,
        details: bm.details,
        weight: 0,
      })),
      intelResults: analysis.intelResults.map((i) => ({
        provider: i.provider as any,
        status: i.status as any,
        isConfigured: true,
        matchDetails: i.matchDetails || undefined,
        lookupTimestamp: i.lookupTimestamp,
      })),
    });

    // Update stored explanation summary
    await db.analysis.update({
      where: { id: analysis.id },
      data: { aiExplanation: explanation.summary },
    });

    return NextResponse.json({ success: true, explanation });
  } catch (error: any) {
    console.error("AI explanation error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
