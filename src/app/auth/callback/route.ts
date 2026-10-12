import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import crypto from "crypto";
import { db } from "@/lib/db";
import { hashPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants";
import { logAuditEvent } from "@/lib/audit/logger";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_auth_code", origin));
  }

  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(new URL("/login?error=missing_auth_configuration", origin));
  }

  const response = NextResponse.redirect(new URL(next, origin));

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Ignore if in read-only phase
          }
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      console.error("Supabase exchangeCodeForSession error:", error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error?.message || "auth_failed")}`, origin)
      );
    }

    const authUser = data.user;
    const email = (authUser.email || "").toLowerCase().trim();
    const name =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.user_metadata?.user_name ||
      email.split("@")[0] ||
      "Judge";

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=no_email_provided", origin));
    }

    const cleanUsername = `${email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "")}_sb`;

    // 1. Sync or find user in Prisma PostgreSQL database
    let user = await db.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      let org = await db.organization.findFirst();
      if (!org) {
        org = await db.organization.create({
          data: { name: "Evaluation & SOC Leadership" },
        });
      }

      let finalUsername = cleanUsername;
      const existingUserWithUsername = await db.user.findUnique({
        where: { username: finalUsername },
      });
      if (existingUserWithUsername) {
        finalUsername = `${cleanUsername}_${Math.floor(100 + Math.random() * 900)}`;
      }

      const randomSecret = crypto.randomBytes(32).toString("hex");
      const passwordHash = await hashPassword(randomSecret);

      user = await db.user.create({
        data: {
          name,
          username: finalUsername,
          email,
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
        metadata: { provider: "google_supabase", method: "SUPABASE_AUTH_OAUTH" },
      }).catch((e) => console.warn("Audit error:", e.message));
    } else {
      await logAuditEvent({
        organizationId: user.organizationId,
        actorId: user.id,
        actorEmail: user.email,
        action: "AUTH_LOGIN_OAUTH",
        resourceType: "User",
        resourceId: user.id,
        metadata: { provider: "google_supabase", method: "SUPABASE_AUTH_OAUTH" },
      }).catch((e) => console.warn("Audit error:", e.message));
    }

    // 2. Issue custom drp_session JWT cookie for platform middleware
    const sessionPayload = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role as any,
      organizationId: user.organizationId,
      organizationName: user.organization?.name || "Optimus Cyber Command",
    };

    const token = await signSessionToken(sessionPayload);
    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (err: any) {
    console.error("Supabase auth callback internal error:", err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || "supabase_callback_failed")}`, origin)
    );
  }
}
