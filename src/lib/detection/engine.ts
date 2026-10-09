import { parseAndNormalizeUrl, ParsedUrlDetails } from "./url-parser";
import { extractHeuristicSignals, DetectionSignalResult } from "./signals";
import { evaluateBrandSimilarity, ProtectedBrand, BrandMatchResult } from "./brand-matcher";
import { calculateRiskScore, RiskScoreBreakdown } from "./risk-scorer";
import { lookupThreatIntelligence, ThreatIntelProviderResult } from "../threat-intel/provider";
import { generateThreatExplanation, ThreatExplanationResult } from "../ai/threat-explainer";
import { INTEL_STATUSES, IntelStatus } from "../constants";

export interface CompleteAnalysisReport {
  isValid: boolean;
  submittedUrl: string;
  normalizedHostname: string;
  registrableDomain: string;
  parsedUrl: ParsedUrlDetails;
  riskScore: RiskScoreBreakdown;
  signals: DetectionSignalResult[];
  brandMatches: BrandMatchResult[];
  intelResults: ThreatIntelProviderResult[];
  overallIntelStatus: IntelStatus;
  aiExplanation: ThreatExplanationResult;
  limitations: string[];
  analyzedAt: string;
  errorMessage?: string;
}

export async function runCompleteThreatAnalysis(
  rawUrl: string,
  protectedBrands: ProtectedBrand[] = []
): Promise<CompleteAnalysisReport> {
  const parsed = parseAndNormalizeUrl(rawUrl);

  if (!parsed.isValid) {
    return {
      isValid: false,
      submittedUrl: rawUrl,
      normalizedHostname: "",
      registrableDomain: "",
      parsedUrl: parsed,
      riskScore: {
        heuristicScore: 0,
        threatIntelBoost: 0,
        finalScore: 0,
        severity: "INFO",
        category: "INFO",
        contributions: [],
        isKnownThreat: false,
      },
      signals: [],
      brandMatches: [],
      intelResults: [],
      overallIntelStatus: INTEL_STATUSES.INCONCLUSIVE,
      aiExplanation: {
        summary: "Invalid URL string provided.",
        whyIndicatorsMatter: [],
        uncertaintyNotes: "Unable to parse URL syntax.",
        recommendedDefensiveActions: [],
        neededFurtherInformation: [],
        isAiGenerated: false,
      },
      limitations: ["URL syntax invalid"],
      analyzedAt: new Date().toISOString(),
      errorMessage: parsed.errorMessage || "Invalid URL syntax",
    };
  }

  // 1. Extract Heuristic Signals
  const signals = extractHeuristicSignals(parsed);

  // 2. Evaluate Brand Impersonation Matches
  const brandMatches = evaluateBrandSimilarity(
    parsed.hostname,
    parsed.registrableDomain,
    protectedBrands
  );

  // 3. Lookup Multi-Provider Threat Intelligence
  const intelResults = await lookupThreatIntelligence({
    url: parsed.normalizedUrl,
    hostname: parsed.hostname,
  });

  const hasConfirmedThreatMatch = intelResults.some(
    (res) => res.status === INTEL_STATUSES.MATCH_FOUND
  );

  let overallIntelStatus: IntelStatus = INTEL_STATUSES.NO_MATCH;
  if (hasConfirmedThreatMatch) {
    overallIntelStatus = INTEL_STATUSES.MATCH_FOUND;
  } else if (intelResults.every((res) => res.status === INTEL_STATUSES.NOT_CONFIGURED)) {
    overallIntelStatus = INTEL_STATUSES.NOT_CONFIGURED;
  } else if (intelResults.some((res) => res.status === INTEL_STATUSES.UNAVAILABLE)) {
    overallIntelStatus = INTEL_STATUSES.UNAVAILABLE;
  }

  // 4. Calculate Risk Score
  const riskScore = calculateRiskScore(signals, brandMatches, hasConfirmedThreatMatch);

  // 5. Generate AI / Structured Threat Explanation
  const aiExplanation = await generateThreatExplanation({
    submittedUrl: parsed.normalizedUrl,
    hostname: parsed.hostname,
    riskScore,
    signals,
    brandMatches,
    intelResults,
  });

  // 6. Define Analysis Limitations
  const limitations = [
    "Lexical & structural analysis performed offline without making live outbound connections (SSRF Safe).",
    "Heuristic scores reflect pattern likelihood and do not guarantee host disposition without live sandbox inspection.",
    intelResults.some((i) => !i.isConfigured)
      ? "Certain third-party threat feeds are unconfigured or running in local offline demo mode."
      : "Active threat intelligence matches checked against available feeds.",
  ];

  return {
    isValid: true,
    submittedUrl: parsed.rawInput,
    normalizedHostname: parsed.hostname,
    registrableDomain: parsed.registrableDomain,
    parsedUrl: parsed,
    riskScore,
    signals,
    brandMatches,
    intelResults,
    overallIntelStatus,
    aiExplanation,
    limitations,
    analyzedAt: new Date().toISOString(),
  };
}
