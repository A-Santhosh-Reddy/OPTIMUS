import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await db.analysis.findFirst({
      where: {
        id: params.id,
        organizationId: user.organizationId,
      },
      include: {
        signals: true,
        brandSimilarities: true,
        intelResults: true,
        incidents: {
          include: {
            assignedUser: { select: { id: true, name: true, email: true } },
            notes: { orderBy: { createdAt: "desc" } },
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error("Fetch analysis detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
