import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { parseAndNormalizeUrl } from "@/lib/detection/url-parser";
import { evaluateBrandSimilarity, calculateLevenshteinDistance, calculateSimilarity } from "@/lib/detection/brand-matcher";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetDomain } = await req.json();
    if (!targetDomain || typeof targetDomain !== "string") {
      return NextResponse.json({ error: "targetDomain is required" }, { status: 400 });
    }

    const parsed = parseAndNormalizeUrl(targetDomain);
    const hostname = parsed.isValid ? parsed.hostname : targetDomain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    const registrable = parsed.isValid ? parsed.registrableDomain : hostname.split(".").slice(-2).join(".");

    // Fetch brands from DB
    const dbBrands = await db.brandAsset.findMany({
      where: { organizationId: user.organizationId, isActive: true },
    });

    const protectedBrands = dbBrands.map((b) => {
      let aliases: string[] = [];
      try {
        aliases = b.aliases ? JSON.parse(b.aliases) : [];
      } catch {}
      return {
        brandName: b.brandName,
        officialDomain: b.officialDomain,
        aliases,
      };
    });

    const matches = evaluateBrandSimilarity(hostname, registrable, protectedBrands);

    const matchDetails = matches.map((m) => {
      const officialBase = m.officialDomain.split(".")[0];
      const targetBase = registrable.split(".")[0];
      return {
        ...m,
        levenshteinDistance: calculateLevenshteinDistance(targetBase, officialBase),
        calculatedSimilarity: calculateSimilarity(targetBase, officialBase),
      };
    });

    return NextResponse.json({
      targetInput: targetDomain,
      parsedHostname: hostname,
      registrableDomain: registrable,
      hasMatch: matches.length > 0,
      matches: matchDetails,
      totalMonitoredBrands: protectedBrands.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to evaluate brand domain" }, { status: 500 });
  }
}
