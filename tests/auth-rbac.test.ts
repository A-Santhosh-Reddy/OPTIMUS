import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signSessionToken, verifySessionToken } from "@/lib/auth/session";
import { isAuthorized, requireAdmin, requireAnalystOrAdmin } from "@/lib/auth/rbac";
import { ROLES } from "@/lib/constants";

describe("Authentication & RBAC Authorization Security", () => {
  it("should securely hash and verify passwords", async () => {
    const plain = "SecOpsPassword2026!";
    const hashed = await hashPassword(plain);
    expect(hashed).not.toBe(plain);
    expect(await verifyPassword(plain, hashed)).toBe(true);
    expect(await verifyPassword("wrong-password", hashed)).toBe(false);
  });

  it("should sign and verify JWT session tokens", async () => {
    const userPayload = {
      id: "usr-123",
      name: "Security Lead",
      username: "secops_lead",
      email: "lead@enterprise.com",
      role: ROLES.ADMIN,
      organizationId: "org-1",
    };

    const token = await signSessionToken(userPayload);
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.username).toBe("secops_lead");
    expect(decoded?.email).toBe(userPayload.email);
    expect(decoded?.role).toBe(ROLES.ADMIN);
  });

  it("should enforce RBAC permissions strictly on the server", () => {
    const adminUser = {
      id: "u1",
      name: "Admin",
      email: "admin@corp.com",
      role: ROLES.ADMIN,
      organizationId: "o1",
    };

    const analystUser = {
      id: "u2",
      name: "Analyst",
      email: "analyst@corp.com",
      role: ROLES.ANALYST,
      organizationId: "o1",
    };

    const viewerUser = {
      id: "u3",
      name: "Viewer",
      email: "viewer@corp.com",
      role: ROLES.VIEWER,
      organizationId: "o1",
    };

    expect(requireAdmin(adminUser)).toBe(true);
    expect(requireAdmin(analystUser)).toBe(false);
    expect(requireAdmin(viewerUser)).toBe(false);

    expect(requireAnalystOrAdmin(adminUser)).toBe(true);
    expect(requireAnalystOrAdmin(analystUser)).toBe(true);
    expect(requireAnalystOrAdmin(viewerUser)).toBe(false);
  });
});
