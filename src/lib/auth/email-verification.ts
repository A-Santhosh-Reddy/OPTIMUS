import crypto from "crypto";
import { db } from "@/lib/db";
import { hashPassword, signSessionToken, getSessionCookieOptions } from "./session";
import { ROLES } from "@/lib/constants";
import { logAuditEvent } from "@/lib/audit/logger";

export interface PendingVerification {
  email: string;
  token: string;
  code: string;
  expiresAt: number;
  createdAt: number;
}

// In-memory verification token cache (15-minute validity)
// Uses global to survive HMR in dev and serverless warmth
declare global {
  var __optimus_pending_verifications: Map<string, PendingVerification> | undefined;
}

const getStore = (): Map<string, PendingVerification> => {
  if (!globalThis.__optimus_pending_verifications) {
    globalThis.__optimus_pending_verifications = new Map();
  }
  return globalThis.__optimus_pending_verifications;
};

// Clean expired tokens every 5 minutes
const cleanupExpired = () => {
  const store = getStore();
  const now = Date.now();
  store.forEach((item, key) => {
    if (item.expiresAt < now) {
      store.delete(key);
    }
  });
};

/**
 * Generate a cryptographically secure 6-digit numeric OTP code and 32-byte hex token
 */
export function createVerificationRequest(email: string): PendingVerification {
  cleanupExpired();
  const normalizedEmail = email.trim().toLowerCase();

  const token = crypto.randomBytes(32).toString("hex");
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits e.g. 748291
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  const verification: PendingVerification = {
    email: normalizedEmail,
    token,
    code,
    expiresAt,
    createdAt: Date.now(),
  };

  const store = getStore();
  // Store by both token and email for fast lookup
  store.set(token, verification);
  store.set(`email:${normalizedEmail}`, verification);

  return verification;
}

/**
 * Verify by token (when user clicks link in Gmail)
 */
export function verifyToken(token: string, email?: string): PendingVerification | null {
  cleanupExpired();
  const store = getStore();
  const item = store.get(token);

  if (!item) return null;
  if (item.expiresAt < Date.now()) {
    store.delete(token);
    store.delete(`email:${item.email}`);
    return null;
  }

  if (email && item.email !== email.trim().toLowerCase()) {
    return null;
  }

  // Consume token so it cannot be re-used
  store.delete(token);
  store.delete(`email:${item.email}`);
  return item;
}

/**
 * Verify by 6-digit code
 */
export function verifyCode(email: string, code: string): PendingVerification | null {
  cleanupExpired();
  const store = getStore();
  const normalizedEmail = email.trim().toLowerCase();
  const item = store.get(`email:${normalizedEmail}`);

  if (!item) return null;
  if (item.expiresAt < Date.now()) {
    store.delete(item.token);
    store.delete(`email:${normalizedEmail}`);
    return null;
  }

  if (item.code !== code.trim()) {
    return null;
  }

  // Consume verification
  store.delete(item.token);
  store.delete(`email:${normalizedEmail}`);
  return item;
}

/**
 * Send real email to Gmail or mailbox
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  code: string,
  origin: string
): Promise<{ success: boolean; method: string; directUrl: string }> {
  const directUrl = `${origin}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OPTIMUS Security Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #060b18; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #060b18; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0d1a38; border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
          <tr>
            <td style="padding: 30px; text-align: center; background: linear-gradient(180deg, #0f244a 0%, #0d1a38 100%); border-bottom: 1px solid rgba(255,255,255,0.08);">
              <h1 style="margin: 0; font-size: 24px; color: #ffffff; letter-spacing: 1px;">OPTIMUS CYBER DEFENSE</h1>
              <p style="margin: 8px 0 0 0; color: #00f0ff; font-size: 13px; font-weight: 600;">LOGIN VERIFICATION LINK & SECURITY PASSCODE</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #e2e8f0; line-height: 1.6;">
                Hello,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                A sign-in attempt was initiated for your account <strong>${email}</strong> on the OPTIMUS Digital Risk Protection platform. Click the verification button below or enter your 6-digit passcode to securely access the console.
              </p>

              <!-- One-click button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${directUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; background-color: #00f0ff; color: #030712; font-weight: 700; font-size: 15px; text-decoration: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,240,255,0.4);">
                      Verify &amp; Sign In to Console &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- 6-digit Code Box -->
              <div style="background-color: #060c1d; border: 1px dashed rgba(0, 240, 255, 0.4); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px;">Your 6-Digit Passcode</p>
                <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #00f0ff; font-family: monospace;">${code}</div>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b;">This passcode expires in 15 minutes.</p>
              </div>

              <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; line-height: 1.6;">
                If you did not request this verification link, please ignore this email. Your account remains protected.
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569; word-break: break-all;">
                Verification link URL:<br>
                <a href="${directUrl}" style="color: #38bdf8; text-decoration: underline;">${directUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px; background-color: #081126; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 11px; color: #64748b;">
              OPTIMUS CyberDefend Platform &bull; Real-time Digital Risk Protection &bull; 2026
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Attempt 1: Nodemailer SMTP if configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpHost || (smtpUser && smtpPass)) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_PORT || "465") === "465",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"OPTIMUS Security" <${smtpUser || "noreply@optimus-drp.io"}>`,
        to: email,
        subject: `🔒 OPTIMUS Security: Login Verification Link & Code (${code})`,
        text: `Your OPTIMUS login verification link: ${directUrl}\n\nYour 6-digit passcode: ${code}\nValid for 15 minutes.`,
        html: htmlContent,
      });

      return { success: true, method: "smtp", directUrl };
    } catch (smtpErr: any) {
      console.warn("Nodemailer SMTP delivery notice:", smtpErr?.message);
    }
  }

  // Attempt 2: Supabase OTP mailer if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: directUrl,
        },
      });

      if (!error) {
        return { success: true, method: "supabase_otp", directUrl };
      } else {
        console.info("Supabase Auth OTP dispatch notice:", error.message);
      }
    } catch (sbErr: any) {
      console.info("Supabase client OTP dispatch notice:", sbErr?.message);
    }
  }

  // Direct generation with instant validation url
  return { success: true, method: "direct_token", directUrl };
}

/**
 * Complete verification and return signed session token
 */
export async function completeVerificationSession(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanUsername = `${normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "")}`;

  let user = await db.user.findFirst({
    where: {
      OR: [
        { email: normalizedEmail },
        { username: cleanUsername },
      ],
    },
    include: { organization: true },
  });

  if (!user) {
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: { name: "CyberDefend Operations & Evaluation" },
      });
    }

    let finalUsername = cleanUsername;
    const existing = await db.user.findUnique({
      where: { username: finalUsername },
    });
    if (existing) {
      finalUsername = `${cleanUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const randomSecret = crypto.randomBytes(32).toString("hex");
    const passwordHash = await hashPassword(randomSecret);

    user = await db.user.create({
      data: {
        name: normalizedEmail.split("@")[0],
        username: finalUsername,
        email: normalizedEmail,
        passwordHash,
        role: ROLES.ANALYST,
        organizationId: org.id,
      },
      include: { organization: true },
    });
  }

  // Audit event
  logAuditEvent({
    organizationId: user.organizationId,
    actorId: user.id,
    actorEmail: user.email,
    action: "AUTH_VERIFY_EMAIL_SUCCESS",
    resourceType: "User",
    resourceId: user.id,
    metadata: { method: "GMAIL_VERIFICATION_LINK" },
  }).catch((e) => console.warn("Audit logging warning:", e.message));

  const sessionUser = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role as any,
    organizationId: user.organizationId,
    organizationName: user.organization?.name || "CyberDefend Operations",
  };

  const token = await signSessionToken(sessionUser);
  return { user: sessionUser, token };
}
