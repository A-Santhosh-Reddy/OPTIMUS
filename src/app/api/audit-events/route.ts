import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/rbac";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!requireAdmin(user)) {
      return NextResponse.json(
        { error: "Forbidden: Administrator role required to view security audit logs" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

    const events = await db.auditEvent.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
