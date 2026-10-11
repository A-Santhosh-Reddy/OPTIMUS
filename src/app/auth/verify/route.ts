import { NextResponse } from "next/server";
import { verifyToken, completeVerificationSession } from "@/lib/auth/email-verification";
import { getSessionCookieOptions } from "@/lib/auth/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");
  const origin = process.env.NEXT_PUBLIC_APP_URL || url.origin;

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_verification_token", origin));
  }

  const verified = verifyToken(token, email || undefined);

  if (!verified) {
    return NextResponse.redirect(
      new URL("/login?error=Invalid+or+expired+verification+link.+Please+request+a+new+one.", origin)
    );
  }

  try {
    const { token: sessionToken } = await completeVerificationSession(verified.email);

    const redirectUrl = new URL("/dashboard?verified=true", origin);
    const response = NextResponse.redirect(redirectUrl);

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, sessionToken, cookieOptions);

    return response;
  } catch (err: any) {
    console.error("Verification callback session creation failed:", err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || "Failed to establish session")}`, origin)
    );
  }
}
