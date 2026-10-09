import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth/session";
import { logAuditEvent } from "@/lib/audit/logger";
import { ROLES } from "@/lib/constants";

const LoginSchema = z.object({
  email: z.string().optional(),
  username: z.string().optional(),
  identifier: z.string().optional(),
  password: z.string().min(1, "Password is required"),
}).refine((data) => data.email || data.username || data.identifier, {
  message: "Email or username is required",
  path: ["email"],
});

// Built-in system accounts for high-availability SOC access
const DEMO_FALLBACK_ACCOUNTS = [
  {
    id: "cmv192n870001hg5hfdzssfbe",
    name: "Alex Vance (SecOps Lead)",
    username: "admin_secops",
    email: "admin@optimus-drp.io",
    password: "admin123!",
    role: ROLES.ADMIN,
    organizationId: "org-cyberdefend-01",
    organizationName: "CyberDefend Global Security Operations",
  },
  {
    id: "cmv192n9m0003hg5h0bxc0g3y",
    name: "Jordan Rivera (Threat Analyst)",
    username: "analyst_jordan",
    email: "analyst@optimus-drp.io",
    password: "analyst123!",
    role: ROLES.ANALYST,
    organizationId: "org-cyberdefend-01",
    organizationName: "CyberDefend Global Security Operations",
  },
  {
    id: "cmv192n9w0005hg5huxapvb5k",
    name: "Morgan Lee (Executive Viewer)",
    username: "viewer_morgan",
    email: "viewer@optimus-drp.io",
    password: "viewer123!",
    role: ROLES.VIEWER,
    organizationId: "org-cyberdefend-01",
    organizationName: "CyberDefend Global Security Operations",
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, username, identifier, password } = parsed.data;
    const loginIdentifier = (identifier || email || username || "").trim().toLowerCase();

    let authenticatedUser: any = null;
    let isFallbackAuth = false;

    // 1. Primary Attempt: Query Database (MySQL / Supabase)
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [
            { email: loginIdentifier },
            { username: loginIdentifier },
          ],
        },
        include: { organization: true },
      });

      if (user) {
        const isMatch = await verifyPassword(password, user.passwordHash);
        if (isMatch) {
          authenticatedUser = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role as any,
            organizationId: user.organizationId,
            organizationName: user.organization?.name || "Enterprise SOC",
          };

          // Record audit event asynchronously (non-blocking)
          logAuditEvent({
            organizationId: user.organizationId,
            actorId: user.id,
            actorEmail: user.email,
            action: "AUTH_LOGIN",
            resourceType: "User",
            resourceId: user.id,
            metadata: { role: user.role, username: user.username },
          }).catch((e) => console.warn("Audit logging deferred:", e.message));
        } else {
          return NextResponse.json(
            { error: "Invalid password for this account. Please try again." },
            { status: 401 }
          );
        }
      } else {
        // User not found in DB
        // Check if matching demo fallback
        const demoMatch = DEMO_FALLBACK_ACCOUNTS.find(
          (d) =>
            (d.email.toLowerCase() === loginIdentifier || d.username.toLowerCase() === loginIdentifier) &&
            d.password === password
        );

        if (demoMatch) {
          authenticatedUser = {
            id: demoMatch.id,
            name: demoMatch.name,
            username: demoMatch.username,
            email: demoMatch.email,
            role: demoMatch.role,
            organizationId: demoMatch.organizationId,
            organizationName: demoMatch.organizationName,
          };
          isFallbackAuth = true;
        } else {
          return NextResponse.json(
            { error: "No account found matching this email or username." },
            { status: 401 }
          );
        }
      }
    } catch (dbError: any) {
      console.warn("Database lookup warning during login:", dbError.message);

      // 2. Resilient Fallback: If DB is temporarily unavailable, check built-in accounts
      const demoMatch = DEMO_FALLBACK_ACCOUNTS.find(
        (d) =>
          (d.email.toLowerCase() === loginIdentifier || d.username.toLowerCase() === loginIdentifier) &&
          d.password === password
      );

      if (demoMatch) {
        authenticatedUser = {
          id: demoMatch.id,
          name: demoMatch.name,
          username: demoMatch.username,
          email: demoMatch.email,
          role: demoMatch.role,
          organizationId: demoMatch.organizationId,
          organizationName: demoMatch.organizationName,
        };
        isFallbackAuth = true;
      } else {
        return NextResponse.json(
          {
            error:
              "Database connection temporarily unavailable and credentials do not match built-in demo accounts. Please ensure MySQL/Supabase is running or use a Demo button.",
          },
          { status: 503 }
        );
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: "Authentication failed. Please verify credentials." },
        { status: 401 }
      );
    }

    // Sign JWT session token
    const token = await signSessionToken(authenticatedUser);

    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
      fallbackMode: isFallbackAuth,
      message: isFallbackAuth
        ? "Authenticated with built-in SOC credentials."
        : "Successfully authenticated with enterprise database.",
    });

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Critical login error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
