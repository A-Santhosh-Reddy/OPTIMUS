import { DetectionSignalResult } from "../detection/signals";
import { BrandMatchResult } from "../detection/brand-matcher";
import { ThreatIntelProviderResult } from "../threat-intel/provider";
import { RiskScoreBreakdown } from "../detection/risk-scorer";

export interface ThreatExplanationPayload {
  submittedUrl: string;
  hostname: string;
  riskScore: RiskScoreBreakdown;
  signals: DetectionSignalResult[];
  brandMatches: BrandMatchResult[];
  intelResults: ThreatIntelProviderResult[];
}

export interface ThreatExplanationResult {
  summary: string;
  whyIndicatorsMatter: string[];
  uncertaintyNotes: string;
  recommendedDefensiveActions: string[];
  neededFurtherInformation: string[];
  isAiGenerated: boolean;
}

export async function generateThreatExplanation(
  payload: ThreatExplanationPayload
): Promise<ThreatExplanationResult> {
  const { submittedUrl, hostname, riskScore, signals, brandMatches, intelResults } = payload;
  const aiApiKey = process.env.AI_API_KEY?.trim();

  // If external AI key is configured (e.g. Gemini / OpenAI / Groq)
  if (aiApiKey) {
    try {
      const prompt = `You are a Senior Cyber Threat Intelligence Analyst. Provide an objective, explainable risk assessment for this URL analysis.
Do NOT invent threat scores, blacklist statuses, or whois data not provided in the evidence below.

EVIDENCE:
- Target URL: ${submittedUrl}
- Hostname: ${hostname}
- Heuristic Risk Score: ${riskScore.heuristicScore}/100
- Final Risk Score: ${riskScore.finalScore}/100 (Severity: ${riskScore.severity})
- Threat Intel Status: ${riskScore.isKnownThreat ? "CONFIRMED MATCH" : "NO ACTIVE INTELLIGENCE MATCH"}
- Detection Signals: ${JSON.stringify(signals.map((s) => ({ type: s.signalType, title: s.title, evidence: s.evidence })))}
- Brand Impersonation Matches: ${JSON.stringify(brandMatches.map((b) => ({ brand: b.brandName, type: b.matchType, details: b.details })))}
- External Intelligence Feeds: ${JSON.stringify(intelResults.map((i) => ({ provider: i.provider, status: i.status })))}

Respond STRICTLY with a valid JSON object matching this structure:
{
  "summary": "2-3 sentence executive threat summary",
  "whyIndicatorsMatter": ["point 1", "point 2"],
  "uncertaintyNotes": "Limitations and why heuristic score is not definitive proof",
  "recommendedDefensiveActions": ["action 1", "action 2"],
  "neededFurtherInformation": ["item 1", "item 2"]
}`;

      // Call Google Gemini API or compatible endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            summary: parsed.summary || "Automated AI risk assessment completed.",
            whyIndicatorsMatter: parsed.whyIndicatorsMatter || [],
            uncertaintyNotes: parsed.uncertaintyNotes || "Heuristic analysis indicates risk factors but does not constitute forensic confirmation.",
            recommendedDefensiveActions: parsed.recommendedDefensiveActions || ["Block URL at secure web gateway", "Alert targeted users"],
            neededFurtherInformation: parsed.neededFurtherInformation || ["DNS passive historical records", "HTTP response headers"],
            isAiGenerated: true,
          };
        }
      }
    } catch (err) {
      console.warn("AI generation failed or timed out, falling back to deterministic engine:", err);
    }
  }

  // Deterministic Rule-Based Threat Explanation Engine
  const whyIndicatorsMatter: string[] = [];
  const recommendedDefensiveActions: string[] = [];
  const neededFurtherInformation: string[] = [
    "Passive DNS telemetry to check domain resolution age and IP fluctuation",
    "SSL/TLS Certificate authority transparency log inspection",
    "Live HTTP response status and DOM payload inspection in an isolated sandbox",
  ];

  if (riskScore.isKnownThreat) {
    whyIndicatorsMatter.push(
      "Confirmed match with known threat intelligence indicators of compromise (IoCs), indicating active or historically validated abuse."
    );
    recommendedDefensiveActions.push(
      "Immediately enforce perimeter domain/IP blocking on edge firewalls and DNS resolvers.",
      "Scan endpoint proxy logs for recent internal connections to this asset.",
      "Revoke session tokens and prompt password resets for any users who submitted credentials to this domain."
    );
  }

  for (const match of brandMatches) {
    if (match.matchType === "SUBDOMAIN_IMPERSONATION") {
      whyIndicatorsMatter.push(
        `Brand impersonation: The hostname incorporates protected brand token "${match.brandName}" under an unrelated apex domain to trick users into trusting the link.`
      );
      recommendedDefensiveActions.push(
        `Submit a trademark / domain abuse takedown request to the registrar for ${match.details}.`
      );
    } else if (match.matchType === "HOMOGLYPH_SUBSTITUTION" || match.matchType === "TYPOSQUATTING") {
      whyIndicatorsMatter.push(
        `Lookalike domain: Visual mimicry of ${match.officialDomain} exploiting character similarities or spelling errors.`
      );
      recommendedDefensiveActions.push(
        `Register defensive domain variants or add ${match.officialDomain} lookalikes to inbound email filter watchlists.`
      );
    }
  }

  for (const sig of signals) {
    if (sig.signalType === "IP_ADDRESS_HOSTNAME") {
      whyIndicatorsMatter.push(
        "Direct IP address usage bypasses normal domain registration transparency and is heavily correlated with ephemeral attack infrastructure."
      );
    } else if (sig.signalType === "AUTH_CREDENTIAL_TARGETING_PATH") {
      whyIndicatorsMatter.push(
        "Path contains authentication or billing keywords, suggesting a potential credential harvesting landing page."
      );
    } else if (sig.signalType === "EXCESSIVE_SUBDOMAINS") {
      whyIndicatorsMatter.push(
        "Multi-tier subdomain nesting is frequently utilized to visually obscure the true destination in mobile browser address bars."
      );
    }
  }

  if (recommendedDefensiveActions.length === 0) {
    if (riskScore.finalScore >= 40) {
      recommendedDefensiveActions.push(
        "Add domain to SOC monitoring watchlist.",
        "Inspect internal email gateway logs for incoming lures referencing this URL."
      );
    } else {
      recommendedDefensiveActions.push(
        "No immediate blocking required. Continue standard defensive telemetry monitoring."
      );
    }
  }

  let summary = "";
  if (riskScore.finalScore >= 70) {
    summary = `CRITICAL RISK: Target asset ${hostname} exhibits strong indicators of brand impersonation or malicious cyber activity with a composite risk score of ${riskScore.finalScore}/100. Rapid containment recommended.`;
  } else if (riskScore.finalScore >= 40) {
    summary = `ELEVATED RISK: Target asset ${hostname} demonstrates suspicious structural or lexical characteristics with a risk score of ${riskScore.finalScore}/100. SOC review advised.`;
  } else if (riskScore.finalScore >= 20) {
    summary = `MODERATE RISK: Target asset ${hostname} displays low-confidence anomalies (score ${riskScore.finalScore}/100). No active threat feed match detected.`;
  } else {
    summary = `LOW RISK / BENIGN: Target asset ${hostname} displays normal structural characteristics with a baseline score of ${riskScore.finalScore}/100.`;
  }

  const uncertaintyNotes =
    "Heuristic signals evaluate structural, lexical, and brand patterns. A high heuristic score indicates elevated suspiciousness but is not mathematical proof of malicious intent. Verification requires corroborating telemetry.";

  return {
    summary,
    whyIndicatorsMatter,
    uncertaintyNotes,
    recommendedDefensiveActions,
    neededFurtherInformation,
    isAiGenerated: false,
  };
}
