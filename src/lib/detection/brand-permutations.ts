import {
  ProtectedBrand,
  evaluateBrandSimilarity,
  calculateLevenshteinDistance,
  calculateSimilarity,
  BrandMatchResult,
} from "./brand-matcher";

export interface BrandLookalikePermutation {
  domain: string;
  attackVector: "HOMOGLYPH" | "TYPOSQUAT" | "SUBDOMAIN" | "KEYWORD_COMPOUND";
  similarityScore: number;
  levenshteinDistance: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  technique: string;
  matchResult: BrandMatchResult;
}

/**
 * Generates realistic adversary lookalike permutations for a given protected brand.
 */
export function generateBrandPermutations(
  brand: ProtectedBrand,
  allBrands: ProtectedBrand[] = [brand]
): BrandLookalikePermutation[] {
  const officialBase = brand.officialDomain.toLowerCase().split(".")[0];
  const officialTld = brand.officialDomain.toLowerCase().split(".").slice(1).join(".") || "com";
  const brandNameClean = brand.brandName.toLowerCase().replace(/[^a-z0-9]/g, "");

  const candidates: { domain: string; attackVector: BrandLookalikePermutation["attackVector"]; technique: string }[] = [];

  // 1. Homoglyphs & Leetspeak Substitutions
  const homoglyphReplacements: Record<string, string[]> = {
    o: ["0"],
    l: ["1", "i"],
    i: ["1", "l"],
    e: ["3"],
    a: ["4"],
    s: ["5"],
    t: ["7"],
    b: ["8"],
    g: ["9"],
    m: ["rn"],
    w: ["vv"],
  };

  // Generate homoglyph variants
  let homoglyphVariant = "";
  for (const ch of officialBase) {
    if (homoglyphReplacements[ch]) {
      homoglyphVariant += homoglyphReplacements[ch][0];
    } else {
      homoglyphVariant += ch;
    }
  }
  if (homoglyphVariant !== officialBase) {
    candidates.push({
      domain: `${homoglyphVariant}.${officialTld}`,
      attackVector: "HOMOGLYPH",
      technique: "Numeric Leetspeak / Visual Character Swap",
    });
    candidates.push({
      domain: `${homoglyphVariant}.top`,
      attackVector: "HOMOGLYPH",
      technique: "Leetspeak substitution on high-risk TLD (.top)",
    });
  }

  // Common Unicode-like or second homoglyph
  if (officialBase.includes("o")) {
    candidates.push({
      domain: `${officialBase.replace(/o/g, "0")}.xyz`,
      attackVector: "HOMOGLYPH",
      technique: "Zero-for-O character spoofing (.xyz)",
    });
  }
  if (officialBase.includes("l")) {
    candidates.push({
      domain: `${officialBase.replace(/l/g, "1")}.live`,
      attackVector: "HOMOGLYPH",
      technique: "One-for-L visual substitution (.live)",
    });
  }
  if (officialBase.includes("e")) {
    candidates.push({
      domain: `${officialBase.replace(/e/g, "3")}.info`,
      attackVector: "HOMOGLYPH",
      technique: "Three-for-E substitution (.info)",
    });
  }

  // 2. Typosquatting (omission, duplicate, transposition)
  if (officialBase.length >= 4) {
    // Character omission (drop last letter)
    const omitted = officialBase.slice(0, -1);
    candidates.push({
      domain: `${omitted}.${officialTld}`,
      attackVector: "TYPOSQUAT",
      technique: "Single character omission typo",
    });

    // Character duplication (double 2nd letter)
    const duplicated = officialBase[0] + officialBase[1] + officialBase.slice(1);
    candidates.push({
      domain: `${duplicated}.${officialTld}`,
      attackVector: "TYPOSQUAT",
      technique: "Double consonant typing error",
    });

    // Letter swap / transposition
    if (officialBase.length >= 3) {
      const swapped = officialBase[0] + officialBase[2] + officialBase[1] + officialBase.slice(3);
      if (swapped !== officialBase) {
        candidates.push({
          domain: `${swapped}.${officialTld}`,
          attackVector: "TYPOSQUAT",
          technique: "Adjacent keyboard transposition",
        });
      }
    }

    // Hyphen insertion
    const hyphenated = `${officialBase.slice(0, 3)}-${officialBase.slice(3)}`;
    candidates.push({
      domain: `${hyphenated}.${officialTld}`,
      attackVector: "TYPOSQUAT",
      technique: "Hyphen-injected lookalike",
    });
  }

  // 3. Subdomain Cloaking & Impersonation
  candidates.push({
    domain: `login.${brand.officialDomain}.auth-gateway.top`,
    attackVector: "SUBDOMAIN",
    technique: "Brand FQDN nested inside deceptive TLD domain",
  });
  candidates.push({
    domain: `secure.${brandNameClean}.com.verify-user.xyz`,
    attackVector: "SUBDOMAIN",
    technique: "Brand-labeled subdomain on untrusted registrar host",
  });
  candidates.push({
    domain: `portal.${brand.officialDomain}.account-sync.net`,
    attackVector: "SUBDOMAIN",
    technique: "Enterprise Single Sign-On deceptive redirection",
  });

  // 4. Keyword Phishing Compounds
  const securityKeywords = ["verify", "security-alert", "portal-login", "account-recovery", "update-center", "auth"];
  for (const kw of securityKeywords.slice(0, 4)) {
    candidates.push({
      domain: `${brandNameClean}-${kw}.com`,
      attackVector: "KEYWORD_COMPOUND",
      technique: `Urgent call-to-action compound (${kw})`,
    });
    candidates.push({
      domain: `${brandNameClean}-${kw}.net`,
      attackVector: "KEYWORD_COMPOUND",
      technique: `Urgent call-to-action compound (${kw} on .net)`,
    });
  }

  // Deduplicate candidates
  const seen = new Set<string>();
  const uniqueCandidates = candidates.filter((c) => {
    if (seen.has(c.domain) || c.domain === brand.officialDomain) return false;
    seen.add(c.domain);
    return true;
  });

  // Score each candidate against evaluateBrandSimilarity
  const permutations: BrandLookalikePermutation[] = [];

  for (const item of uniqueCandidates) {
    const regDomain = item.domain.split(".").slice(-2).join(".");
    const matches = evaluateBrandSimilarity(item.domain, regDomain, allBrands);
    const primaryMatch = matches.find((m) => m.brandName.toLowerCase() === brand.brandName.toLowerCase()) || matches[0];

    const simScore = primaryMatch ? primaryMatch.similarityScore : calculateSimilarity(regDomain.split(".")[0], officialBase);
    const dist = calculateLevenshteinDistance(regDomain.split(".")[0], officialBase);

    let severity: BrandLookalikePermutation["severity"] = "MEDIUM";
    if (simScore >= 0.9 || item.attackVector === "SUBDOMAIN") {
      severity = "CRITICAL";
    } else if (simScore >= 0.8) {
      severity = "HIGH";
    }

    permutations.push({
      domain: item.domain,
      attackVector: item.attackVector,
      similarityScore: Math.round(simScore * 100) / 100,
      levenshteinDistance: dist,
      severity,
      technique: item.technique,
      matchResult: primaryMatch || {
        brandName: brand.brandName,
        officialDomain: brand.officialDomain,
        similarityScore: simScore,
        matchType: "TYPOSQUATTING",
        details: item.technique,
        weight: 25,
      },
    });
  }

  // Sort by highest risk / similarity score
  return permutations.sort((a, b) => b.similarityScore - a.similarityScore);
}
