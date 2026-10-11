import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getAlertConfigs,
  upsertAlertConfig,
  removeAlertConfig,
} from "@/lib/alerts/alert-engine";

const AlertConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  type: z.enum(["WEBHOOK", "SLACK", "EMAIL"]),
  endpoint: z.string().min(1).max(500),
  minSeverity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    return NextResponse.json({ configs: getAlertConfigs() });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (user.role === "VIEWER") {
      return NextResponse.json({ error: "Viewer role has read-only access to alert configurations" }, { status: 403 });
    }

    const body = await req.json();

    // Check if this is a test alert dispatch request
    if (body.action === "TEST_ALERT") {
      const { dispatchAlerts } = await import("@/lib/alerts/alert-engine");
      const delivery = await dispatchAlerts(
        "test_analysis_id",
        body.minSeverity || "CRITICAL",
        92,
        "paypal-security-verification.xyz",
        "https://paypal-security-verification.xyz/login",
        4,
        ["Newly Registered Domain (<30d)", "Excessive Subdomain Depth", "High Entropy / DGA"],
        ["PayPal"],
        "MATCH_FOUND",
        "OPTIMUS SOC Automated Test Alert: Verified webhook endpoint connectivity and Slack block format alignment."
      );
      return NextResponse.json({ success: true, testDelivery: delivery });
    }

    const parsed = AlertConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid alert config", details: parsed.error.format() }, { status: 400 });
    }

    const config = {
      ...parsed.data,
      id: parsed.data.id || `alert_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };

    upsertAlertConfig(config);

    return NextResponse.json({ success: true, config });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (user.role === "VIEWER") {
      return NextResponse.json({ error: "Insufficient permissions to delete alert rules" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Alert config ID is required" }, { status: 400 });
    }

    const removed = removeAlertConfig(id);
    return NextResponse.json({ success: removed });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
