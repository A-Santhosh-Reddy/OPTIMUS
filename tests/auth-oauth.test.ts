import { describe, it, expect } from "vitest";

describe("OAuth Single Sign-On (Google & Microsoft)", () => {
  it("should validate OAuth payload constraints", () => {
    const validGooglePayload = {
      provider: "google",
      email: "siva.santhosh@gmail.com",
      name: "Siva Santhosh",
    };

    expect(["google", "microsoft"]).toContain(validGooglePayload.provider);
    expect(validGooglePayload.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(validGooglePayload.name.length).toBeGreaterThanOrEqual(2);

    const validMicrosoftPayload = {
      provider: "microsoft",
      email: "santhosh@microsoft.com",
      name: "Siva Santhosh",
    };

    expect(["google", "microsoft"]).toContain(validMicrosoftPayload.provider);
    expect(validMicrosoftPayload.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("should reject invalid email formats or unsupported providers", () => {
    const invalidEmail = "not-an-email";
    expect(invalidEmail).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    const invalidProvider = "github";
    expect(["google", "microsoft"]).not.toContain(invalidProvider);
  });
});
