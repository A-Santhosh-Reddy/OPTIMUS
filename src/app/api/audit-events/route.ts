import { NextResponse } from "next/server";
import { db, withDbRetry } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAnalystOrAdmin } from "@/lib/auth/rbac";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Allow both Analysts and Admins to view SOC telemetry audit logs
    if (!requireAnalystOrAdmin(user)) {
      return NextResponse.json(
        { error: "Forbidden: Security Analyst or Administrator role required to view security audit logs" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

    let events: any[] = [];
    try {
      events = await withDbRetry(() =>
        db.auditEvent.findMany({
          where: { organizationId: user.organizationId },
          orderBy: { timestamp: "desc" },
          take: limit,
          include: {
            actor: { select: { id: true, name: true, email: true, role: true } },
          },
        })
      );
    } catch (dbErr: any) {
      console.warn("Could not query auditEvent from primary DB, returning empty logs:", dbErr.message);
      events = [];
    }

    return NextResponse.json({ events: Array.isArray(events) ? events : [] });
  } catch (error: any) {
    console.error("Failed to fetch audit logs error:", error);
    return NextResponse.json({ events: [] }, { status: 200 });
  }
}
