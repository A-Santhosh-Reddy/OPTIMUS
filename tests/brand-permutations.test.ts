import { describe, it, expect } from "vitest";
import { generateBrandPermutations } from "@/lib/detection/brand-permutations";
import { ProtectedBrand } from "@/lib/detection/brand-matcher";

describe("Brand Lookalike & Permutation Generator", () => {
  const brand: ProtectedBrand = {
    brandName: "PayPal",
    officialDomain: "paypal.com",
    aliases: ["paypal.co.uk"],
  };

  it("should generate diverse adversarial permutations across all 4 attack vectors", () => {
    const permutations = generateBrandPermutations(brand);

    expect(permutations.length).toBeGreaterThan(5);

    const vectors = new Set(permutations.map((p) => p.attackVector));
    expect(vectors.has("HOMOGLYPH")).toBe(true);
    expect(vectors.has("TYPOSQUAT")).toBe(true);
    expect(vectors.has("SUBDOMAIN")).toBe(true);
    expect(vectors.has("KEYWORD_COMPOUND")).toBe(true);
  });

  it("should calculate similarity scores and severity for permutations", () => {
    const permutations = generateBrandPermutations(brand);

    for (const p of permutations) {
      expect(p.similarityScore).toBeGreaterThanOrEqual(0);
      expect(p.similarityScore).toBeLessThanOrEqual(1.0);
      expect(["CRITICAL", "HIGH", "MEDIUM"]).toContain(p.severity);
      expect(p.domain).toBeDefined();
    }
  });

  it("should properly score leetspeak/homoglyph mutations like 0-for-o or 1-for-l", () => {
    const googleBrand: ProtectedBrand = {
      brandName: "Google",
      officialDomain: "google.com",
    };
    const permutations = generateBrandPermutations(googleBrand);
    const homoglyph = permutations.find((p) => p.attackVector === "HOMOGLYPH");

    expect(homoglyph).toBeDefined();
    expect(homoglyph?.similarityScore).toBeGreaterThanOrEqual(0.7);
  });
});
