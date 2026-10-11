import { parseAndNormalizeUrl, ParsedUrlDetails } from "./url-parser";
import { extractHeuristicSignals, DetectionSignalResult } from "./signals";
import { evaluateBrandSimilarity, ProtectedBrand, BrandMatchResult } from "./brand-matcher";
import { calculateRiskScore, RiskScoreBreakdown } from "./risk-scorer";
import { lookupThreatIntelligence, ThreatIntelProviderResult } from "../threat-intel/provider";
import { generateThreatExplanation, ThreatExplanationResult } from "../ai/threat-explainer";
import { lookupWhoisDns, WhoisDnsResult } from "./whois-dns";
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
  whoisDns: WhoisDnsResult | null;
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
      whoisDns: null,
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

  // 3. Lookup Threat Intelligence + WHOIS/DNS Intelligence in parallel
  const [intelResults, whoisDns] = await Promise.all([
    lookupThreatIntelligence({
      url: parsed.normalizedUrl,
      hostname: parsed.hostname,
    }),
    lookupWhoisDns(parsed.registrableDomain, parsed.isIpAddress),
  ]);

  // 4. Inject WHOIS/DNS-derived signals into the heuristic signals array
  if (whoisDns && whoisDns.lookupStatus !== "SKIPPED") {
    if (whoisDns.domainAge.isNewlyRegistered && whoisDns.domainAge.ageDays !== null) {
      signals.push({
        signalType: "NEWLY_REGISTERED_DOMAIN",
        category: "DOMAIN_STRUCTURE",
        title: "Newly Registered Domain (< 30 days)",
        description: `Domain was registered only ${whoisDns.domainAge.ageDays} day(s) ago. Newly registered domains are statistically 10x more likely to be associated with phishing, malware distribution, or disposable attack infrastructure.`,
        evidence: `Registration date: ${whoisDns.domainAge.registrationDate} (${whoisDns.domainAge.ageDays} days ago)`,
        weight: 25,
        confidence: "HIGH",
      });
    } else if (whoisDns.domainAge.isRecentlyRegistered && whoisDns.domainAge.ageDays !== null) {
      signals.push({
        signalType: "RECENTLY_REGISTERED_DOMAIN",
        category: "DOMAIN_STRUCTURE",
        title: "Recently Registered Domain (< 90 days)",
        description: `Domain was registered ${whoisDns.domainAge.ageDays} day(s) ago. Recently registered domains have an elevated risk profile compared to established domains.`,
        evidence: `Registration date: ${whoisDns.domainAge.registrationDate} (${whoisDns.domainAge.ageDays} days ago)`,
        weight: 15,
        confidence: "MEDIUM",
      });
    }

    // Suspicious nameserver signal
    for (const indicator of whoisDns.riskIndicators) {
      if (indicator.type === "SUSPICIOUS_NAMESERVER") {
        signals.push({
          signalType: "SUSPICIOUS_NAMESERVER",
          category: "NETWORK_HEURISTIC",
          title: indicator.title,
          description: indicator.description,
          evidence: `Nameservers: ${whoisDns.nameservers.join(", ")}`,
          weight: 15,
          confidence: "MEDIUM",
        });
      }
    }
  }

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

  // 5. Calculate Risk Score
  const riskScore = calculateRiskScore(signals, brandMatches, hasConfirmedThreatMatch);

  // 6. Generate AI / Structured Threat Explanation
  const aiExplanation = await generateThreatExplanation({
    submittedUrl: parsed.normalizedUrl,
    hostname: parsed.hostname,
    riskScore,
    signals,
    brandMatches,
    intelResults,
  });

  // 7. Define Analysis Limitations
  const limitations = [
    "Lexical & structural analysis performed offline without making live outbound connections (SSRF Safe).",
    "Heuristic scores reflect pattern likelihood and do not guarantee host disposition without live sandbox inspection.",
    intelResults.some((i) => !i.isConfigured)
      ? "Certain third-party threat feeds are unconfigured or running in local offline demo mode."
      : "Active threat intelligence matches checked against available feeds.",
    whoisDns?.lookupStatus === "SUCCESS"
      ? "WHOIS/DNS intelligence enrichment completed successfully via public RDAP and DNS-over-HTTPS APIs."
      : whoisDns?.lookupStatus === "PARTIAL"
      ? "WHOIS/DNS enrichment returned partial data; some registrar information may be unavailable."
      : "WHOIS/DNS enrichment was not available for this target.",
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
    whoisDns,
    overallIntelStatus,
    aiExplanation,
    limitations,
    analyzedAt: new Date().toISOString(),
  };
}
