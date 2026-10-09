import { describe, it, expect } from "vitest";
import { lookupThreatIntelligence, LOCAL_MALICIOUS_IOCS } from "@/lib/threat-intel/provider";
import { INTEL_STATUSES } from "@/lib/constants";

describe("Multi-Provider Threat Intelligence Engine", () => {
  it("should match known malicious domains against local high-confidence IoC feed", async () => {
    const results = await lookupThreatIntelligence({
      url: "https://banking-update-verify.top/login",
      hostname: "banking-update-verify.top",
    });

    const localFeed = results.find((r) => r.provider === "LOCAL_TEST_FEED");
    expect(localFeed).toBeDefined();
    expect(localFeed?.status).toBe(INTEL_STATUSES.MATCH_FOUND);
    expect(localFeed?.threatTypes).toContain("BANKING_TROJAN");
  });

  it("should return NO_MATCH for benign domain on local feed", async () => {
    const results = await lookupThreatIntelligence({
      url: "https://github.com",
      hostname: "github.com",
    });

    const localFeed = results.find((r) => r.provider === "LOCAL_TEST_FEED");
    expect(localFeed).toBeDefined();
    expect(localFeed?.status).toBe(INTEL_STATUSES.NO_MATCH);
  });

  it("should produce high-fidelity sandbox telemetry when simulation mode is active", async () => {
    const results = await lookupThreatIntelligence({
      url: "https://paypal-security-alert.xyz/verify",
      hostname: "paypal-security-alert.xyz",
      forceSandboxSimulation: true,
    });

    const vt = results.find((r) => r.provider === "VIRUSTOTAL");
    const gsb = results.find((r) => r.provider === "GOOGLE_SAFE_BROWSING");
    const urlScan = results.find((r) => r.provider === "URLSCAN");

    expect(vt?.isConfigured).toBe(true);
    expect(vt?.status).toBe(INTEL_STATUSES.MATCH_FOUND);
    expect(vt?.engineDetections?.detected).toBeGreaterThan(0);

    expect(gsb?.isConfigured).toBe(true);
    expect(gsb?.status).toBe(INTEL_STATUSES.MATCH_FOUND);

    expect(urlScan?.isConfigured).toBe(true);
    expect(urlScan?.status).toBe(INTEL_STATUSES.MATCH_FOUND);
  });
});
