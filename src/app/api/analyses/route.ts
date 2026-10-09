import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const severity = searchParams.get("severity");
    const query = searchParams.get("q")?.trim();
    const intelStatus = searchParams.get("intelStatus");

    const whereClause: any = {
      organizationId: user.organizationId,
    };

    if (severity && severity !== "ALL") {
      whereClause.severity = severity;
    }

    if (intelStatus && intelStatus !== "ALL") {
      whereClause.intelligenceStatus = intelStatus;
    }

    if (query) {
      whereClause.OR = [
        { normalizedHostname: { contains: query } },
        { registrableDomain: { contains: query } },
        { submittedUrl: { contains: query } },
      ];
    }

    const [total, items] = await Promise.all([
      db.analysis.count({ where: whereClause }),
      db.analysis.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          signals: true,
          intelResults: true,
          incidents: {
            select: { id: true, status: true, severity: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Fetch analyses error:", error);
    return NextResponse.json({ error: "Failed to retrieve analyses" }, { status: 500 });
  }
}
