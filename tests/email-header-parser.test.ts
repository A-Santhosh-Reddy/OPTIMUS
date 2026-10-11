import { describe, it, expect } from "vitest";
import { analyzeEmailHeaders } from "@/lib/detection/email-header-parser";

describe("Email Header Forensics & Spoofing Detection Engine", () => {
  it("should flag failed SPF, DKIM, and DMARC as critical phishing indicators", () => {
    const rawHeaders = `From: "PayPal Support" <service@paypal.com>
Reply-To: phisher@evil-domain.xyz
Return-Path: <bounce@unauthorized-server.top>
Subject: Urgent Security Alert: Account Suspended
Received-SPF: fail (domain of service@paypal.com does not designate sender)
Authentication-Results: mx.google.com; dkim=fail; spf=fail; dmarc=fail (p=REJECT)
Message-ID: <123456@evil-domain.xyz>`;

    const result = analyzeEmailHeaders(rawHeaders);
    expect(result.sender.isSpoofed).toBe(true);
    expect(result.authentication.spf.status).toBe("FAIL");
    expect(result.authentication.dkim.status).toBe("FAIL");
    expect(result.authentication.dmarc.status).toBe("FAIL");
    expect(result.riskScore).toBeGreaterThanOrEqual(50);
    expect(result.overallRisk).toBe("CRITICAL");
  });

  it("should extract embedded URLs from header payloads", () => {
    const rawHeaders = `From: noreply@example.com
Subject: Test Newsletter
List-Unsubscribe: <https://newsletter.example.com/unsubscribe?id=123>
X-Target: https://malicious-lure.xyz/click`;

    const result = analyzeEmailHeaders(rawHeaders);
    expect(result.extractedUrls).toContain("https://newsletter.example.com/unsubscribe?id=123");
    expect(result.extractedUrls).toContain("https://malicious-lure.xyz/click");
  });

  it("should evaluate legitimate authenticated emails as CLEAN/LOW", () => {
    const rawHeaders = `From: "GitHub" <notifications@github.com>
Reply-To: notifications@github.com
Return-Path: <notifications@github.com>
Subject: [GitHub] Security Alert
Received-SPF: pass (client-ip=209.85.208.65)
Authentication-Results: mx.google.com; dkim=pass; spf=pass; dmarc=pass (p=REJECT)
Message-ID: <valid-id@github.com>`;

    const result = analyzeEmailHeaders(rawHeaders);
    expect(result.sender.isSpoofed).toBe(false);
    expect(result.authentication.overallVerdict).toBe("PASS");
    expect(result.overallRisk).toBe("CLEAN");
    expect(result.riskScore).toBe(0);
  });
});
