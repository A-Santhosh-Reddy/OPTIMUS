import { describe, it, expect } from "vitest";
import { parseAndNormalizeUrl } from "@/lib/detection/url-parser";
import { extractHeuristicSignals, calculateShannonEntropy } from "@/lib/detection/signals";

describe("Heuristic Threat Signals Engine", () => {
  it("should calculate Shannon entropy accurately", () => {
    const lowEntropy = calculateShannonEntropy("aaaaaa");
    const highEntropy = calculateShannonEntropy("q7x9w2zp8k1");
    expect(lowEntropy).toBeLessThan(1.0);
    expect(highEntropy).toBeGreaterThan(3.0);
  });

  it("should flag direct IP address hostnames", () => {
    const parsed = parseAndNormalizeUrl("http://194.26.29.112:8080/verify");
    const signals = extractHeuristicSignals(parsed);
    const ipSignal = signals.find((s) => s.signalType === "IP_ADDRESS_HOSTNAME");
    expect(ipSignal).toBeDefined();
    expect(ipSignal?.weight).toBeGreaterThanOrEqual(30);
  });

  it("should flag excessive subdomains and suspicious authentication paths", () => {
    const parsed = parseAndNormalizeUrl("https://verify.account.billing.update.malicious-domain.xyz/auth/login");
    const signals = extractHeuristicSignals(parsed);

    const subdomainsSignal = signals.find((s) => s.signalType === "EXCESSIVE_SUBDOMAINS");
    const authPathSignal = signals.find((s) => s.signalType === "AUTH_CREDENTIAL_TARGETING_PATH");
    const tldSignal = signals.find((s) => s.signalType === "HIGH_RISK_TLD");

    expect(subdomainsSignal).toBeDefined();
    expect(authPathSignal).toBeDefined();
    expect(tldSignal).toBeDefined();
  });

  it("should not flag normal benign URLs as critical", () => {
    const parsed = parseAndNormalizeUrl("https://www.apple.com/iphone-16-pro/specs/");
    const signals = extractHeuristicSignals(parsed);
    expect(signals.length).toBe(0);
  });
});
