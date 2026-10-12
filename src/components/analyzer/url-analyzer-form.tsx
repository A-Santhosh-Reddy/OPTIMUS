"use client";

import React, { useState } from "react";
import { Search, ShieldAlert, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "../ui/button";

interface UrlAnalyzerFormProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_QUICK_TARGETS = [
  {
    label: "Spoofed Microsoft Subdomain",
    url: "https://login.microsoft.com.account-update-portal.xyz/verify/session?auth=token",
    type: "CRITICAL",
  },
  {
    label: "PayPal Homoglyph Lookalike",
    url: "https://paypa1-security-center.top/update-billing",
    type: "CRITICAL",
  },
  {
    label: "Raw IP Phishing Endpoint",
    url: "https://194.26.29.112:8443/login/verify.php",
    type: "HIGH",
  },
  {
    label: "Official Legitimate Domain",
    url: "https://www.apple.com/iphone-16-pro/specs/",
    type: "BENIGN",
  },
];

export function UrlAnalyzerForm({ onAnalyze, isLoading }: UrlAnalyzerFormProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!inputUrl.trim()) {
      setError("Please enter a valid URL or domain string");
      return;
    }
    try {
      await onAnalyze(inputUrl.trim());
    } catch (err: any) {
      setError(err.message || "Threat analysis request failed");
    }
  };

  const handleQuickSelect = (url: string) => {
    setInputUrl(url);
    setError(null);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-cyan-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter suspicious URL or domain (e.g. https://login.microsoft.com.account-portal.xyz/verify)"
              disabled={isLoading}
              className="liquid-glass-input w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 font-mono"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            variant="cyan"
            className="sm:w-auto w-full px-7 font-semibold shadow-liquid-cyan"
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            Inspect Vector
          </Button>
        </div>

        {error && (
          <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/50 p-3.5 text-xs text-red-300 backdrop-blur-md">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Quick Test Vectors in Liquid Glass */}
      <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-4.5 backdrop-blur-md">
        <p className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5 font-mono">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Verified Demonstration Threat Vectors:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_QUICK_TARGETS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickSelect(sample.url)}
              className="flex items-center justify-between text-left p-3 rounded-xl border border-white/[0.06] bg-slate-900/40 hover:bg-cyan-950/30 hover:border-cyan-500/30 transition-all text-xs group"
            >
              <div className="min-w-0 pr-2">
                <span className="font-semibold text-slate-200 block truncate group-hover:text-cyan-300 transition-colors">
                  {sample.label}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block truncate mt-0.5">
                  {sample.url}
                </span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                  sample.type === "CRITICAL"
                    ? "bg-red-950/80 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    : sample.type === "HIGH"
                    ? "bg-orange-950/80 text-orange-400 border border-orange-500/40"
                    : "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {sample.type}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
