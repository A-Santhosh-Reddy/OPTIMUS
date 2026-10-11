import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCode, completeVerificationSession } from "@/lib/auth/email-verification";
import { getSessionCookieOptions } from "@/lib/auth/session";

const VerifySchema = z.object({
  email: z.string().email("Valid email required"),
  code: z.string().min(6, "6-digit code required").max(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    const verified = verifyCode(email, code);

    if (!verified) {
      return NextResponse.json(
        { error: "Invalid or expired 6-digit verification code. Please request a new code." },
        { status: 401 }
      );
    }

    const { user, token } = await completeVerificationSession(email);

    const response = NextResponse.json({
      success: true,
      user,
      redirect: "/dashboard",
      message: "Email verification successful. Access granted.",
    });

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Code verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify security code" },
      { status: 500 }
    );
  }
}
