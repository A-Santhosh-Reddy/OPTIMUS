"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldAlert, Sparkles, AlertCircle, History, Fingerprint } from "lucide-react";
import { UrlAnalyzerForm } from "@/components/analyzer/url-analyzer-form";
import { AnalysisResultView } from "@/components/analyzer/analysis-result-view";
import { Card } from "@/components/ui/card";

export default function AnalyzerPage() {
  const router = useRouter();
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setCurrentAnalysis(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      // Extract complete structured analysis result including WHOIS/DNS intelligence
      setCurrentAnalysis({
        ...data.analysis,
        whoisDns: data.report?.whoisDns || null,
        report: data.report,
      });
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#00DCC2]/10 border border-[#00DCC2]/30 text-[#00DCC2]">
            OFFLINE LEXICAL ENGINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#E7F4F1] flex items-center gap-2 font-mono">
          Suspicious URL &amp; Domain Analyzer
        </h1>
        <p className="text-xs text-[#A0B8B2] mt-1">
          Perform safe, offline lexical inspection, Shannon entropy evaluation, brand impersonation detection, and threat intelligence correlation.
        </p>
      </div>

      {/* Analysis Input Form */}
      <Card glow="cyan">
        <UrlAnalyzerForm onAnalyze={handleAnalyze} isLoading={isLoading} />
      </Card>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 rounded-2xl border border-[#28504A] bg-[#112624] p-10 text-center animate-pulse">
          <div className="relative h-12 w-12 mx-auto rounded-2xl bg-[#00DCC2]/15 border border-[#00DCC2]/30 flex items-center justify-center text-[#00DCC2] shadow-[0_0_15px_rgba(0,220,194,0.2)]">
            <Search className="h-6 w-6 animate-spin" />
          </div>
          <h3 className="text-sm font-semibold text-[#E7F4F1] font-mono tracking-wide">
            Executing Multi-Layer Threat Heuristics &amp; Brand Shields...
          </h3>
          <p className="text-xs text-[#A0B8B2] font-mono">
            Evaluating Shannon Entropy &bull; Levenshtein Edit Distance &bull; Homoglyph Normalization
          </p>
        </div>
      )}

      {/* Structured Detection Results View */}
      {currentAnalysis && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AnalysisResultView analysis={currentAnalysis} />
        </div>
      )}
    </div>
  );
}
