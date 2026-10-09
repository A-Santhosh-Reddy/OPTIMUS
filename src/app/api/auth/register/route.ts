import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants";
import { logAuditEvent } from "@/lib/audit/logger";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens")
    .optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  organizationName: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, username, email, password, organizationName } = parsed.data;

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    // Determine normalized username
    const normalizedUsername = username ? username.toLowerCase() : email.split("@")[0].toLowerCase();

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken. Please choose another username." },
        { status: 400 }
      );
    }

    // Assign to existing organization or create default
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: { name: organizationName || "Default Security Operations" },
      });
    }

    // Encrypt password securely using bcrypt with 10 salt rounds
    const passwordHash = await hashPassword(password);

    // Save user record to MySQL
    const newUser = await db.user.create({
      data: {
        name,
        username: normalizedUsername,
        email: email.toLowerCase(),
        passwordHash,
        role: ROLES.ANALYST, // Standard analyst account by default
        organizationId: org.id,
      },
      include: { organization: true },
    });

    const sessionPayload = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role as any,
      organizationId: newUser.organizationId,
      organizationName: newUser.organization.name,
    };

    const token = await signSessionToken(sessionPayload);

    await logAuditEvent({
      organizationId: newUser.organizationId,
      actorId: newUser.id,
      actorEmail: newUser.email,
      action: "AUTH_REGISTER",
      resourceType: "User",
      resourceId: newUser.id,
      metadata: { username: newUser.username },
    });

    const response = NextResponse.json({
      success: true,
      user: sessionPayload,
    });

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
