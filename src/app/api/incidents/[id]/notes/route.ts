import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { canModifyIncident } from "@/lib/auth/rbac";
import { logAuditEvent } from "@/lib/audit/logger";

const NoteSchema = z.object({
  content: z.string().min(1, "Note content cannot be empty").max(5000, "Note too long"),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canModifyIncident(user)) {
      return NextResponse.json(
        { error: "Forbidden: Security Analyst or Admin role required" },
        { status: 403 }
      );
    }

    const incident = await db.incident.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
    });

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = NoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const note = await db.investigationNote.create({
      data: {
        incidentId: incident.id,
        authorId: user.id,
        authorName: user.name,
        content: parsed.data.content,
      },
    });

    // Automatically progress status to INVESTIGATING if it was NEW
    if (incident.status === "NEW") {
      await db.incident.update({
        where: { id: incident.id },
        data: { status: "INVESTIGATING" },
      });
    }

    await logAuditEvent({
      organizationId: user.organizationId,
      actorId: user.id,
      actorEmail: user.email,
      action: "NOTE_ADDED",
      resourceType: "Incident",
      resourceId: incident.id,
    });

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    console.error("Add note error:", error);
    return NextResponse.json({ error: "Failed to add investigation note" }, { status: 500 });
  }
}
