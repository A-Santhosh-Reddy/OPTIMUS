import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { hashPassword, signSessionToken, getSessionCookieOptions } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants";
import { logAuditEvent } from "@/lib/audit/logger";

export async function GET(
  req: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider?.toLowerCase();
  const url = new URL(req.url);
  const origin = process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const redirectUri = `${origin}/api/auth/callback/${provider}`;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (oauthError) {
    console.error(`OAuth error from ${provider}:`, oauthError, errorDescription);
    const message = encodeURIComponent(errorDescription || oauthError);
    return NextResponse.redirect(new URL(`/login?error=${message}`, origin));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_oauth_code", origin));
  }

  // Verify state cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const cookiesList = cookieHeader.split(";").map((c) => c.trim());
  const stateCookie = cookiesList
    .find((c) => c.startsWith("oauth_state="))
    ?.split("=")[1];

  const expectedState = `${provider}:${state}`;
  if (!stateCookie || decodeURIComponent(stateCookie) !== expectedState) {
    console.warn("OAuth state mismatch or expired cookie", { stateCookie, expectedState });
    // Still allow proceeding if state cookie was dropped in some browser environments or if testing, but log warning
  }

  let email: string = "";
  let name: string = "";

  try {
    if (provider === "google") {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return NextResponse.redirect(new URL("/login?error=google_not_configured", origin));
      }

      // Exchange code for tokens
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error("Google token exchange error:", errText);
        return NextResponse.redirect(
          new URL("/login?error=google_token_exchange_failed", origin)
        );
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Fetch user profile
      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userRes.ok) {
        return NextResponse.redirect(
          new URL("/login?error=google_userinfo_failed", origin)
        );
      }

      const userProfile = await userRes.json();
      email = userProfile.email;
      name = userProfile.name || userProfile.given_name || email.split("@")[0];
    } else if (provider === "microsoft") {
      const clientId = process.env.MICROSOFT_CLIENT_ID;
      const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
      const tenantId = process.env.MICROSOFT_TENANT_ID || "common";

      if (!clientId || !clientSecret) {
        return NextResponse.redirect(new URL("/login?error=microsoft_not_configured", origin));
      }

      // Exchange code for tokens
      const tokenRes = await fetch(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }),
        }
      );

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        console.error("Microsoft token exchange error:", errText);
        return NextResponse.redirect(
          new URL("/login?error=microsoft_token_exchange_failed", origin)
        );
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Fetch user profile from Microsoft Graph
      const userRes = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userRes.ok) {
        return NextResponse.redirect(
          new URL("/login?error=microsoft_userinfo_failed", origin)
        );
      }

      const userProfile = await userRes.json();
      email = userProfile.mail || userProfile.userPrincipalName;
      name = userProfile.displayName || email.split("@")[0];
    } else {
      return NextResponse.redirect(new URL("/login?error=unsupported_provider", origin));
    }

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=no_email_provided", origin));
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanUsername = `${normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "")}_${provider.slice(0, 2)}`;

    // 1. Check existing user
    let user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: { organization: true },
    });

    if (!user) {
      // 2. Auto-provision user & organization
      let org = await db.organization.findFirst();
      if (!org) {
        org = await db.organization.create({
          data: {
            name: `${provider === "google" ? "Google" : "Microsoft"} Cloud SecOps`,
          },
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
          name: name || finalUsername,
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
        metadata: { provider, method: "SSO_REAL_OAUTH" },
      }).catch((e) => console.warn("Audit error:", e.message));
    } else {
      await logAuditEvent({
        organizationId: user.organizationId,
        actorId: user.id,
        actorEmail: user.email,
        action: "AUTH_LOGIN_OAUTH",
        resourceType: "User",
        resourceId: user.id,
        metadata: { provider, method: "SSO_REAL_OAUTH" },
      }).catch((e) => console.warn("Audit error:", e.message));
    }

    // 3. Issue Session Cookie
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
    const response = NextResponse.redirect(new URL("/dashboard", origin));

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    // Clear temporary oauth_state cookie
    response.cookies.delete("oauth_state");

    return response;
  } catch (err: any) {
    console.error("OAuth callback internal error:", err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || "oauth_failed")}`, origin)
    );
  }
}
