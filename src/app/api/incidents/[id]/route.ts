import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { canModifyIncident } from "@/lib/auth/rbac";
import { logAuditEvent } from "@/lib/audit/logger";

const UpdateIncidentSchema = z.object({
  status: z.enum(["NEW", "INVESTIGATING", "ESCALATED", "RESOLVED", "FALSE_POSITIVE"]).optional(),
  assignedUserId: z.string().nullable().optional(),
  analystConclusion: z.string().optional(),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]).optional(),
  isFalsePositive: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incident = await db.incident.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
      include: {
        analysis: {
          include: {
            signals: true,
            brandSimilarities: true,
            intelResults: true,
          },
        },
        assignedUser: { select: { id: true, name: true, email: true, role: true } },
        notes: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    return NextResponse.json({ incident });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
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
        { error: "Forbidden: Analyst or Admin privileges required to update incidents" },
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
    const parsed = UpdateIncidentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
    }

    const updateData: any = {};
    if (parsed.data.status !== undefined) {
      updateData.status = parsed.data.status;
      if (parsed.data.status === "RESOLVED" || parsed.data.status === "FALSE_POSITIVE") {
        updateData.resolvedAt = new Date();
      }
    }
    if (parsed.data.assignedUserId !== undefined) {
      updateData.assignedUserId = parsed.data.assignedUserId;
    }
    if (parsed.data.analystConclusion !== undefined) {
      updateData.analystConclusion = parsed.data.analystConclusion;
    }
    if (parsed.data.severity !== undefined) {
      updateData.severity = parsed.data.severity;
    }
    if (parsed.data.isFalsePositive !== undefined) {
      updateData.isFalsePositive = parsed.data.isFalsePositive;
    }

    const updated = await db.incident.update({
      where: { id: incident.id },
      data: updateData,
      include: {
        analysis: true,
        assignedUser: true,
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    await logAuditEvent({
      organizationId: user.organizationId,
      actorId: user.id,
      actorEmail: user.email,
      action: "INCIDENT_UPDATED",
      resourceType: "Incident",
      resourceId: incident.id,
      metadata: { changes: updateData },
    });

    return NextResponse.json({ success: true, incident: updated });
  } catch (error: any) {
    console.error("Update incident error:", error);
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 });
  }
}
