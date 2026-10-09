import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db } from "@/lib/db";
import { hashPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants";
import { logAuditEvent } from "@/lib/audit/logger";

const OAuthPayloadSchema = z.object({
  provider: z.enum(["google", "microsoft"]),
  email: z.string().email("Valid corporate or personal email required"),
  name: z.string().min(2, "Name is required"),
  organizationName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = OAuthPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid OAuth submission payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { provider, email, name, organizationName } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const cleanUsername = `${normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "")}_${provider.slice(0, 2)}`;

    // 1. Look for existing user with this email
    let user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: { organization: true },
    });

    if (!user) {
      // 2. User doesn't exist yet -> Auto-provision via OAuth Single Sign-On
      let org = await db.organization.findFirst();
      if (!org) {
        org = await db.organization.create({
          data: { name: organizationName || `${provider === "google" ? "Google" : "Microsoft"} Cloud SecOps` },
        });
      }

      // Check username collision
      let finalUsername = cleanUsername;
      const existingUserWithUsername = await db.user.findUnique({
        where: { username: finalUsername },
      });
      if (existingUserWithUsername) {
        finalUsername = `${cleanUsername}_${Math.floor(100 + Math.random() * 900)}`;
      }

      // Generate a secure high-entropy random password hash for OAuth accounts
      const randomSecret = crypto.randomBytes(32).toString("hex");
      const passwordHash = await hashPassword(randomSecret);

      user = await db.user.create({
        data: {
          name,
          username: finalUsername,
          email: normalizedEmail,
          passwordHash,
          role: ROLES.ANALYST,
          organizationId: org.id,
        },
        include: { organization: true },
      });

      await logAuditEvent({
        organizationId: user.organizationId,
        actorId: user.id,
        actorEmail: user.email,
        action: "AUTH_REGISTER_OAUTH",
        resourceType: "User",
        resourceId: user.id,
        metadata: { provider, method: "SSO_AUTO_PROVISION" },
      }).catch((e) => console.warn("Audit error:", e.message));
    } else {
      await logAuditEvent({
        organizationId: user.organizationId,
        actorId: user.id,
        actorEmail: user.email,
        action: "AUTH_LOGIN_OAUTH",
        resourceType: "User",
        resourceId: user.id,
        metadata: { provider, method: "SSO_LOGIN" },
      }).catch((e) => console.warn("Audit error:", e.message));
    }

    // 3. Create authenticated JWT session token
    const sessionPayload = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role as any,
      organizationId: user.organizationId,
      organizationName: user.organization?.name || "Enterprise SOC",
    };

    const token = await signSessionToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      provider,
      user: sessionPayload,
      message: `Successfully authenticated via ${provider === "google" ? "Google Workspace" : "Microsoft Entra ID"}.`,
    });

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("OAuth authentication error:", error);
    return NextResponse.json(
      { error: "Single Sign-On authentication encountered an internal error: " + error.message },
      { status: 500 }
    );
  }
}
