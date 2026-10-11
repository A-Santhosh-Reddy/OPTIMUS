import { NextResponse } from "next/server";
import { z } from "zod";
import { createVerificationRequest, sendVerificationEmail } from "@/lib/auth/email-verification";

const RequestSchema = z.object({
  email: z.string().email("Please provide a valid email address (e.g. yourname@gmail.com)"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const url = new URL(req.url);
    const origin = process.env.NEXT_PUBLIC_APP_URL || url.origin;

    const { token, code } = createVerificationRequest(email);
    const emailResult = await sendVerificationEmail(email, token, code, origin);

    return NextResponse.json({
      success: true,
      email,
      token,
      code,
      method: emailResult.method,
      directUrl: emailResult.directUrl,
      message: `A secure verification link and 6-digit code has been dispatched to ${email}.`,
    });
  } catch (error: any) {
    console.error("Error sending verification link:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate verification link" },
      { status: 500 }
    );
  }
}
