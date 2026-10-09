import { db } from "../db";

export interface LogAuditParams {
  organizationId: string;
  actorId?: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent(params: LogAuditParams): Promise<void> {
  try {
    await db.auditEvent.create({
      data: {
        organizationId: params.organizationId,
        actorId: params.actorId || null,
        actorEmail: params.actorEmail,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId || null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (err) {
    console.error("Failed to write security audit log:", err);
  }
}
