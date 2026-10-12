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
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300">
            OFFLINE LEXICAL ENGINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
          Suspicious URL & Domain Analyzer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Perform safe, offline lexical inspection, Shannon entropy evaluation, brand impersonation detection, and threat intelligence correlation.
        </p>
      </div>

      {/* Analysis Input Form in Liquid Glass */}
      <Card glow="cyber">
        <UrlAnalyzerForm onAnalyze={handleAnalyze} isLoading={isLoading} />
      </Card>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 rounded-2xl border border-sky-500/30 liquid-glass-card p-10 text-center animate-pulse">
          <div className="relative h-12 w-12 mx-auto rounded-2xl bg-blue-600/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-lg shadow-blue-500/20">
            <Search className="h-6 w-6 animate-spin" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100 font-mono tracking-wide">
            Executing Multi-Layer Threat Heuristics & Brand Shields...
          </h3>
          <p className="text-xs text-sky-300/70 font-mono">
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
