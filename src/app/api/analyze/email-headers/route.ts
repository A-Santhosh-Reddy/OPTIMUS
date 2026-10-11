import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { analyzeEmailHeaders } from "@/lib/detection/email-header-parser";
import { logAuditEvent } from "@/lib/audit/logger";

const EmailHeadersSchema = z.object({
  rawHeaders: z
    .string()
    .min(10, "Email headers must be at least 10 characters")
    .max(100000, "Email headers exceed maximum supported size"),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required for email header analysis" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = EmailHeadersSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email headers submission", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { rawHeaders } = parsed.data;
    const result = analyzeEmailHeaders(rawHeaders);

    // Write audit event
    await logAuditEvent({
      organizationId: user.organizationId,
      actorId: user.id,
      actorEmail: user.email,
      action: "EMAIL_HEADERS_ANALYZED",
      resourceType: "EmailAnalysis",
      metadata: {
        fromEmail: result.sender.from,
        riskScore: result.riskScore,
        overallRisk: result.overallRisk,
        authVerdict: result.authentication.overallVerdict,
        isSpoofed: result.sender.isSpoofed,
        extractedUrlCount: result.extractedUrls.length,
      },
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Email header analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error during email header analysis" },
      { status: 500 }
    );
  }
}
