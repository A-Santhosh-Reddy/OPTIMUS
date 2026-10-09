import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getSandboxSimulationMode } from "@/lib/threat-intel/provider";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSandboxActive = getSandboxSimulationMode();
    const gsbEnv = Boolean(process.env.GOOGLE_SAFE_BROWSING_API_KEY?.trim());
    const vtEnv = Boolean(process.env.VIRUSTOTAL_API_KEY?.trim());
    const urlScanEnv = Boolean(process.env.URLSCAN_API_KEY?.trim());

    const providers = [
      {
        name: "Google Safe Browsing API",
        key: "GOOGLE_SAFE_BROWSING",
        isConfigured: gsbEnv || isSandboxActive,
        isLiveKey: gsbEnv,
        isSandbox: !gsbEnv && isSandboxActive,
        envVar: "GOOGLE_SAFE_BROWSING_API_KEY",
        status: gsbEnv ? "OPERATIONAL" : isSandboxActive ? "OPERATIONAL (SANDBOX)" : "NOT_CONFIGURED",
        type: "Malware & Phishing List",
        rateLimit: "10,000 req/day",
        description: "Google's real-time corpus of billions of malicious web pages and social engineering traps.",
      },
      {
        name: "VirusTotal V3 API",
        key: "VIRUSTOTAL",
        isConfigured: vtEnv || isSandboxActive,
        isLiveKey: vtEnv,
        isSandbox: !vtEnv && isSandboxActive,
        envVar: "VIRUSTOTAL_API_KEY",
        status: vtEnv ? "OPERATIONAL" : isSandboxActive ? "OPERATIONAL (SANDBOX)" : "NOT_CONFIGURED",
        type: "Multi-Engine Threat Aggregator",
        rateLimit: "4 req/min (Free tier)",
        description: "Aggregated telemetry from 70+ antivirus scanners and domain blocklisting services.",
      },
      {
        name: "URLScan.io API",
        key: "URLSCAN",
        isConfigured: urlScanEnv || isSandboxActive,
        isLiveKey: urlScanEnv,
        isSandbox: !urlScanEnv && isSandboxActive,
        envVar: "URLSCAN_API_KEY",
        status: urlScanEnv ? "OPERATIONAL" : isSandboxActive ? "OPERATIONAL (SANDBOX)" : "NOT_CONFIGURED",
        type: "Active Web Sandbox & DOM Telemetry",
        rateLimit: "100 req/day",
        description: "Automated headless browser sandbox executing DOM inspection and network recording.",
      },
      {
        name: "Local High-Confidence Threat Feed",
        key: "LOCAL_TEST_FEED",
        isConfigured: true,
        isLiveKey: true,
        isSandbox: false,
        envVar: "BUILT_IN",
        status: "OPERATIONAL",
        type: "Local Heuristic & IoC Engine",
        rateLimit: "Unlimited (Zero Latency)",
        description: "High-confidence offline intelligence repository of confirmed C2 and banking phish IoCs.",
      },
    ];

    return NextResponse.json({
      providers,
      isSandboxActive,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch threat intelligence status" }, { status: 500 });
  }
}
