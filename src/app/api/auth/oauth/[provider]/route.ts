import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(
  req: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider?.toLowerCase();
  const url = new URL(req.url);
  const origin = process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const redirectUri = `${origin}/api/auth/callback/${provider}`;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.redirect(
        new URL(
          "/login?error=google_not_configured&provider=google",
          origin
        )
      );
    }

    const state = crypto.randomBytes(32).toString("hex");
    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "online",
      prompt: "select_account",
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;
    const response = NextResponse.redirect(googleAuthUrl);

    response.cookies.set("oauth_state", `google:${state}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutes
    });

    return response;
  }

  if (provider === "microsoft") {
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    if (!clientId) {
      return NextResponse.redirect(
        new URL(
          "/login?error=microsoft_not_configured&provider=microsoft",
          origin
        )
      );
    }

    const tenantId = process.env.MICROSOFT_TENANT_ID || "common";
    const state = crypto.randomBytes(32).toString("hex");
    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      response_mode: "query",
      scope: "openid email profile User.Read",
      state,
      prompt: "select_account",
    });

    const msAuthUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${authParams.toString()}`;
    const response = NextResponse.redirect(msAuthUrl);

    response.cookies.set("oauth_state", `microsoft:${state}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutes
    });

    return response;
  }

  return NextResponse.redirect(new URL("/login?error=unsupported_provider", origin));
}
