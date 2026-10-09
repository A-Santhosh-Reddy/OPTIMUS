import { describe, it, expect } from "vitest";
import { calculateRiskScore } from "@/lib/detection/risk-scorer";
import { DetectionSignalResult } from "@/lib/detection/signals";
import { BrandMatchResult } from "@/lib/detection/brand-matcher";

describe("Deterministic Risk Scorer", () => {
  it("should calculate baseline zero risk for benign URLs", () => {
    const result = calculateRiskScore([], [], false);
    expect(result.finalScore).toBe(0);
    expect(result.severity).toBe("LOW");
  });

  it("should elevate score to 100 for verified threat intel matches", () => {
    const result = calculateRiskScore([], [], true);
    expect(result.finalScore).toBe(100);
    expect(result.severity).toBe("CRITICAL");
    expect(result.isKnownThreat).toBe(true);
  });

  it("should combine independent heuristic weights and deduplicate", () => {
    const signals: DetectionSignalResult[] = [
      {
        signalType: "IP_ADDRESS_HOSTNAME",
        category: "NETWORK_HEURISTIC",
        title: "IP Address",
        description: "IP",
        evidence: "1.1.1.1",
        weight: 30,
        confidence: "HIGH",
      },
      {
        signalType: "AUTH_CREDENTIAL_TARGETING_PATH",
        category: "URL_ANOMALY",
        title: "Auth Path",
        description: "Path",
        evidence: "/login",
        weight: 25,
        confidence: "HIGH",
      },
    ];

    const result = calculateRiskScore(signals, [], false);
    expect(result.finalScore).toBe(55);
    expect(result.severity).toBe("HIGH");
  });
});
