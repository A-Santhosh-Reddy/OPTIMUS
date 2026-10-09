import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { parseAndNormalizeUrl } from "@/lib/detection/url-parser";
import { lookupThreatIntelligence } from "@/lib/threat-intel/provider";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { target, forceSandboxSimulation } = await req.json();
    if (!target || typeof target !== "string") {
      return NextResponse.json({ error: "Target URL or domain is required" }, { status: 400 });
    }

    const parsed = parseAndNormalizeUrl(target);
    const normalizedUrl = parsed.isValid ? parsed.normalizedUrl : (target.startsWith("http") ? target : `http://${target}`);
    const hostname = parsed.isValid ? parsed.hostname : target.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();

    const startTime = Date.now();
    const results = await lookupThreatIntelligence({
      url: normalizedUrl,
      hostname,
      forceSandboxSimulation: Boolean(forceSandboxSimulation),
    });
    const totalLatency = Date.now() - startTime;

    const matchesCount = results.filter((r) => r.status === "MATCH_FOUND").length;

    return NextResponse.json({
      target,
      normalizedUrl,
      hostname,
      totalLatencyMs: totalLatency,
      hasConfirmedThreat: matchesCount > 0,
      matchesCount,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Threat intelligence query execution failed" }, { status: 500 });
  }
}
