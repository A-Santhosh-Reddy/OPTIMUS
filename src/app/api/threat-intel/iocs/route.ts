import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { LOCAL_MALICIOUS_IOCS } from "@/lib/threat-intel/provider";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const iocs = Array.from(LOCAL_MALICIOUS_IOCS.entries()).map(([domain, data]) => ({
      domain,
      ...data,
    }));

    return NextResponse.json({ iocs, total: iocs.length });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch threat feed IoCs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain, threatType, description } = await req.json();
    if (!domain || typeof domain !== "string") {
      return NextResponse.json({ error: "Valid domain is required" }, { status: 400 });
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, "").split("/")[0];
    LOCAL_MALICIOUS_IOCS.set(cleanDomain, {
      type: Array.isArray(threatType) ? threatType : [threatType || "SUSPICIOUS_LURE"],
      description: description || "Analyst-submitted threat IoC indicator",
      firstSeen: new Date().toISOString().split("T")[0],
    });

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      totalIocs: LOCAL_MALICIOUS_IOCS.size,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add IoC to threat feed" }, { status: 500 });
  }
}
