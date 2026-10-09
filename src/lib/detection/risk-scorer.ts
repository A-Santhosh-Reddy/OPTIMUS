import { DetectionSignalResult } from "./signals";
import { BrandMatchResult } from "./brand-matcher";
import { SEVERITIES, Severity } from "../constants";

export interface RiskScoreBreakdown {
  heuristicScore: number;
  threatIntelBoost: number;
  finalScore: number;
  severity: Severity;
  category: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  contributions: {
    source: string;
    description: string;
    points: number;
  }[];
  isKnownThreat: boolean;
}

export function calculateRiskScore(
  signals: DetectionSignalResult[],
  brandMatches: BrandMatchResult[],
  threatIntelMatched: boolean
): RiskScoreBreakdown {
  const contributions: { source: string; description: string; points: number }[] = [];
  let score = 0;

  // Deduplication tracker to prevent counting duplicate underlying indicators
  const seenTypes = new Set<string>();

  // 1. Process Brand Matches
  for (const match of brandMatches) {
    if (match.matchType === "EXACT_OFFICIAL") {
      // Whitelist / official brand domain: suppresses risk
      contributions.push({
        source: "BRAND_MATCH",
        description: `Verified official domain for ${match.brandName} (-30)`,
        points: -30,
      });
      score = Math.max(0, score - 30);
      continue;
    }

    if (!seenTypes.has(match.matchType)) {
      seenTypes.add(match.matchType);
      contributions.push({
        source: "BRAND_MATCH",
        description: `${match.details} (+${match.weight})`,
        points: match.weight,
      });
      score += match.weight;
    }
  }

  // 2. Process Heuristic Signals
  for (const sig of signals) {
    if (!seenTypes.has(sig.signalType)) {
      seenTypes.add(sig.signalType);
      contributions.push({
        source: "HEURISTIC_SIGNAL",
        description: `${sig.title} (+${sig.weight})`,
        points: sig.weight,
      });
      score += sig.weight;
    }
  }

  // Cap heuristic score to 0..95 (leave 100 for verified external threat intel matches)
  const heuristicScore = Math.min(95, Math.max(0, score));
  let finalScore = heuristicScore;
  let threatIntelBoost = 0;

  // 3. Known Threat Intel Match
  if (threatIntelMatched) {
    threatIntelBoost = Math.max(0, 100 - finalScore);
    finalScore = 100;
    contributions.push({
      source: "THREAT_INTELLIGENCE",
      description: "Confirmed Threat Intelligence Database match (+override to 100)",
      points: threatIntelBoost,
    });
  }

  // Categorize Severity according to requirements
  // 0–19: Low, 20–39: Moderate (Medium), 40–69: High, 70–100: Critical
  let severity: Severity = SEVERITIES.LOW;
  if (finalScore >= 70) {
    severity = SEVERITIES.CRITICAL;
  } else if (finalScore >= 40) {
    severity = SEVERITIES.HIGH;
  } else if (finalScore >= 20) {
    severity = SEVERITIES.MEDIUM;
  } else {
    severity = SEVERITIES.LOW;
  }

  return {
    heuristicScore,
    threatIntelBoost,
    finalScore,
    severity,
    category: severity,
    contributions,
    isKnownThreat: threatIntelMatched,
  };
}
