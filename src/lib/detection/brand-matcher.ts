/**
 * Brand Impersonation & Lookalike Domain Detection Engine
 * Uses Levenshtein distance, homoglyph/typosquatting analysis, and keyword matching.
 */

export interface ProtectedBrand {
  brandName: string;
  officialDomain: string;
  aliases?: string[];
}

export interface BrandMatchResult {
  brandName: string;
  officialDomain: string;
  similarityScore: number; // 0.0 to 1.0
  matchType: "EXACT_OFFICIAL" | "SUBDOMAIN_IMPERSONATION" | "TYPOSQUATTING" | "HOMOGLYPH_SUBSTITUTION" | "KEYWORD_COMBINATION" | "NO_MATCH";
  details: string;
  weight: number;
}

// Common homoglyphs and leetspeak substitution map
const HOMOGLYPH_MAP: Record<string, string[]> = {
  o: ["0", "q", "d", "c", "ó", "ö"],
  l: ["1", "i", "!", "|", "ł"],
  i: ["1", "l", "!", "j", "í", "ï"],
  e: ["3", "€", "é", "è"],
  a: ["4", "@", "q", "á", "à"],
  s: ["5", "$", "z", "š"],
  t: ["7", "+", "†"],
  b: ["8", "6", "d"],
  g: ["9", "q", "6"],
  w: ["vv", "uu"],
  m: ["rn", "nn"],
};

export function calculateLevenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

export function calculateSimilarity(a: string, b: string): number {
  const distance = calculateLevenshteinDistance(a.toLowerCase(), b.toLowerCase());
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1.0;
  return Math.max(0, 1 - distance / maxLength);
}

function normalizeHomoglyphs(str: string): string {
  let result = str.toLowerCase();
  result = result.replace(/0/g, "o")
                 .replace(/1/g, "l")
                 .replace(/3/g, "e")
                 .replace(/4/g, "a")
                 .replace(/5/g, "s")
                 .replace(/7/g, "t")
                 .replace(/8/g, "b")
                 .replace(/vv/g, "w")
                 .replace(/rn/g, "m");
  return result;
}

export function evaluateBrandSimilarity(
  hostname: string,
  registrableDomain: string,
  brands: ProtectedBrand[]
): BrandMatchResult[] {
  const matches: BrandMatchResult[] = [];
  const normalizedHost = hostname.toLowerCase();
  const normalizedReg = registrableDomain.toLowerCase();

  for (const brand of brands) {
    const brandNameLower = brand.brandName.toLowerCase();
    const officialDomainLower = brand.officialDomain.toLowerCase();
    const officialBase = officialDomainLower.split(".")[0];
    const candidateBase = normalizedReg.split(".")[0];

    // 1. Exact Match on Official Domain
    if (normalizedReg === officialDomainLower) {
      matches.push({
        brandName: brand.brandName,
        officialDomain: brand.officialDomain,
        similarityScore: 1.0,
        matchType: "EXACT_OFFICIAL",
        details: `Exact match for official brand domain ${brand.officialDomain}`,
        weight: 0,
      });
      continue;
    }

    // 2. Subdomain Impersonation: Brand is embedded in a subdomain of an unrelated registrable domain
    // e.g. login.microsoft.com.attacker-domain.xyz
    if (
      normalizedHost.includes(officialDomainLower) ||
      normalizedHost.includes(brandNameLower)
    ) {
      if (normalizedReg !== officialDomainLower) {
        matches.push({
          brandName: brand.brandName,
          officialDomain: brand.officialDomain,
          similarityScore: 0.95,
          matchType: "SUBDOMAIN_IMPERSONATION",
          details: `Host includes brand token "${brand.brandName}" within an unrelated domain (${normalizedReg})`,
          weight: 35,
        });
        continue;
      }
    }

    // 3. Homoglyph Substitution Check
    const homoglyphNormalizedBase = normalizeHomoglyphs(candidateBase);
    if (homoglyphNormalizedBase === officialBase && candidateBase !== officialBase) {
      matches.push({
        brandName: brand.brandName,
        officialDomain: brand.officialDomain,
        similarityScore: 0.92,
        matchType: "HOMOGLYPH_SUBSTITUTION",
        details: `Homoglyph character substitution detected (e.g. 0->o, 1->l, vv->w) targeting ${brand.officialDomain}`,
        weight: 30,
      });
      continue;
    }

    // 4. Typosquatting / Edit Distance on Base Domain
    const distance = calculateLevenshteinDistance(candidateBase, officialBase);
    const sim = calculateSimilarity(candidateBase, officialBase);

    if (distance > 0 && distance <= 2 && officialBase.length >= 4) {
      matches.push({
        brandName: brand.brandName,
        officialDomain: brand.officialDomain,
        similarityScore: Math.round(sim * 100) / 100,
        matchType: "TYPOSQUATTING",
        details: `Typosquatting variant of ${brand.officialDomain} (edit distance: ${distance})`,
        weight: 25,
      });
      continue;
    }

    // 5. Keyword Combination: e.g. brand-security.com, brand-verify.com, mybrand-support.com
    const securityAffixes = ["login", "secure", "verify", "account", "support", "auth", "portal", "update", "bank", "pay"];
    const hasBrandKeyword = candidateBase.includes(brandNameLower) || candidateBase.includes(officialBase);
    const hasSecurityAffix = securityAffixes.some((affix) => candidateBase.includes(affix));

    if (hasBrandKeyword && hasSecurityAffix && normalizedReg !== officialDomainLower) {
      matches.push({
        brandName: brand.brandName,
        officialDomain: brand.officialDomain,
        similarityScore: 0.88,
        matchType: "KEYWORD_COMBINATION",
        details: `Deceptive compound domain combining brand keyword "${brand.brandName}" with security/auth terms`,
        weight: 25,
      });
    }
  }

  return matches;
}
