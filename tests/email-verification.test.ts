import { describe, it, expect } from "vitest";
import {
  createVerificationRequest,
  verifyToken,
  verifyCode,
} from "../src/lib/auth/email-verification";

describe("Email Verification and Security Link System", () => {
  it("should generate a valid 6-digit code and 32-byte token", () => {
    const email = "analyst.test@gmail.com";
    const req = createVerificationRequest(email);

    expect(req.email).toBe(email);
    expect(req.token).toBeDefined();
    expect(req.token.length).toBe(64); // 32 bytes hex = 64 characters
    expect(req.code).toMatch(/^\d{6}$/); // 6 digits numeric
    expect(req.expiresAt).toBeGreaterThan(Date.now());
  });

  it("should verify successfully using the generated token and single-use consume it", () => {
    const email = "user.verify@gmail.com";
    const req = createVerificationRequest(email);

    const verified = verifyToken(req.token, email);
    expect(verified).not.toBeNull();
    expect(verified?.email).toBe(email);

    // Second verification should fail (token consumed)
    const secondAttempt = verifyToken(req.token, email);
    expect(secondAttempt).toBeNull();
  });

  it("should verify successfully using the 6-digit passcode and single-use consume it", () => {
    const email = "secops.officer@gmail.com";
    const req = createVerificationRequest(email);

    const verified = verifyCode(email, req.code);
    expect(verified).not.toBeNull();
    expect(verified?.email).toBe(email);

    // Second attempt should fail
    const secondAttempt = verifyCode(email, req.code);
    expect(secondAttempt).toBeNull();
  });

  it("should reject an invalid 6-digit passcode", () => {
    const email = "target.user@gmail.com";
    createVerificationRequest(email);

    const badAttempt = verifyCode(email, "000000");
    expect(badAttempt).toBeNull();
  });
});
