"use client";

import React, { useState } from "react";
import { Layers, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BatchUpload } from "@/components/analyzer/batch-upload";
import { BatchResults } from "@/components/analyzer/batch-results";
import { BatchAnalysisItem } from "@/app/api/analyze/batch/route";

export default function BatchScannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [scanResponse, setScanResponse] = useState<{
    summary: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
      failed: number;
    };
    results: BatchAnalysisItem[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartScan = async (urls: string[], autoEscalate: boolean) => {
    setIsLoading(true);
    setError(null);
    setScanResponse(null);

    try {
      const res = await fetch("/api/analyze/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls, autoEscalate }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process batch scan");
      }

      setScanResponse(data);
    } catch (err: any) {
      setError(err.message || "Failed to complete batch analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#00DCC2]/10 border border-[#00DCC2]/30 text-[#00DCC2]">
            HIGH-THROUGHPUT ENGINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#E7F4F1] flex items-center gap-2 font-mono">
          Bulk URL &amp; CSV Threat Scanner
        </h1>
        <p className="text-xs text-[#A0B8B2] mt-1 max-w-3xl">
          Evaluate up to 500 URLs concurrently. Designed for incident response teams, SIEM log triage, and
          threat intelligence feed ingestion with automatic critical escalation and CSV exports.
        </p>
      </div>

      {/* Upload & Form Card */}
      <Card glow="cyan">
        <BatchUpload onStartScan={handleStartScan} isLoading={isLoading} />
      </Card>

      {error && (
        <div className="p-4 rounded-xl bg-[#FF6474]/15 border border-[#FF6474]/40 text-[#FF6474] text-xs font-mono flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-[#FF6474] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-2xl border border-[#28504A] bg-[#112624] p-12 text-center animate-pulse">
          <Layers className="h-10 w-10 mx-auto text-[#00DCC2] animate-spin mb-3" />
          <h3 className="text-sm font-semibold text-[#E7F4F1] font-mono tracking-wide">
            Processing Parallel Batches (10 URLs/chunk)...
          </h3>
          <p className="text-xs text-[#A0B8B2] font-mono mt-1">
            Running Lexical Parsers &bull; Shannon Entropy &bull; WHOIS / RDAP &bull; Brand Shields
          </p>
        </div>
      )}

      {/* Results View */}
      {scanResponse && (
        <BatchResults summary={scanResponse.summary} results={scanResponse.results} />
      )}
    </div>
  );
}
