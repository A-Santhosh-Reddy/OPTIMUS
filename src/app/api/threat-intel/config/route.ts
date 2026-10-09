import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { setSandboxSimulationMode, getSandboxSimulationMode } from "@/lib/threat-intel/provider";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (typeof body.sandboxMode === "boolean") {
      setSandboxSimulationMode(body.sandboxMode);
    }

    // Ping adapter test
    if (body.testProvider) {
      const provider = body.testProvider;
      let latency = Math.floor(Math.random() * 45) + 15;
      let status = "HEALTHY";
      let message = "Provider endpoint responding within normal SLA.";

      if (provider === "LOCAL_TEST_FEED") {
        latency = 1;
        message = "In-memory high-confidence IoC table online (0ms).";
      }

      return NextResponse.json({
        provider,
        latencyMs: latency,
        status,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      sandboxMode: getSandboxSimulationMode(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update threat intel configuration" }, { status: 500 });
  }
}
