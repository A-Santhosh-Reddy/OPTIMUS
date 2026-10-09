import { describe, it, expect } from "vitest";
import {
  calculateLevenshteinDistance,
  calculateSimilarity,
  evaluateBrandSimilarity,
  ProtectedBrand,
} from "@/lib/detection/brand-matcher";

describe("Brand Impersonation & Typosquatting Matcher", () => {
  const protectedBrands: ProtectedBrand[] = [
    { brandName: "Microsoft", officialDomain: "microsoft.com" },
    { brandName: "PayPal", officialDomain: "paypal.com" },
    { brandName: "Apple", officialDomain: "apple.com" },
  ];

  it("should calculate Levenshtein distance correctly", () => {
    expect(calculateLevenshteinDistance("paypal", "paypa1")).toBe(1);
    expect(calculateLevenshteinDistance("apple", "aple")).toBe(1);
    expect(calculateLevenshteinDistance("microsoft", "microsoft")).toBe(0);
  });

  it("should detect exact official brand domains and whitelist them", () => {
    const matches = evaluateBrandSimilarity("apple.com", "apple.com", protectedBrands);
    expect(matches.length).toBe(1);
    expect(matches[0].matchType).toBe("EXACT_OFFICIAL");
  });

  it("should detect subdomain impersonation targeting brands", () => {
    const matches = evaluateBrandSimilarity(
      "login.microsoft.com.account-update.xyz",
      "account-update.xyz",
      protectedBrands
    );
    const subMatch = matches.find((m) => m.matchType === "SUBDOMAIN_IMPERSONATION");
    expect(subMatch).toBeDefined();
    expect(subMatch?.brandName).toBe("Microsoft");
  });

  it("should detect homoglyph character substitutions (e.g., paypa1)", () => {
    const matches = evaluateBrandSimilarity(
      "paypa1.top",
      "paypa1.top",
      protectedBrands
    );
    const homoglyph = matches.find(
      (m) => m.matchType === "HOMOGLYPH_SUBSTITUTION" || m.matchType === "TYPOSQUATTING"
    );
    expect(homoglyph).toBeDefined();
    expect(homoglyph?.brandName).toBe("PayPal");
  });
});
