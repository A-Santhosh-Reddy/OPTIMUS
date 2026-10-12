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
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#00DCC2]">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter suspicious URL or domain (e.g. https://login.microsoft.com.account-portal.xyz/verify)"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#031C1B] border border-[#28504A] pl-12 pr-4 py-3.5 text-sm text-[#E7F4F1] placeholder-[#718C85] font-mono focus:border-[#00DCC2] focus:outline-none focus:ring-1 focus:ring-[#00DCC2]"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            variant="cyan"
            className="sm:w-auto w-full px-7 font-semibold shadow-[0_0_15px_rgba(0,220,194,0.2)]"
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            Inspect Vector
          </Button>
        </div>

        {error && (
          <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-[#FF6474]/40 bg-[#FF6474]/15 p-3.5 text-xs text-[#FF6474]">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#FF6474]" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Quick Test Vectors */}
      <div className="rounded-2xl border border-[#193E39] bg-[#0B302D] p-4">
        <p className="text-xs font-semibold text-[#A0B8B2] mb-2.5 flex items-center gap-1.5 font-mono">
          <Sparkles className="h-3.5 w-3.5 text-[#00DCC2]" />
          <span>Verified Demonstration Threat Vectors:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_QUICK_TARGETS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickSelect(sample.url)}
              className="flex items-center justify-between text-left p-3 rounded-xl border border-[#193E39] bg-[#112624] hover:bg-[#163632] hover:border-[#28504A] transition-all text-xs group"
            >
              <div className="min-w-0 pr-2">
                <span className="font-semibold text-[#E7F4F1] block truncate group-hover:text-[#00DCC2] transition-colors">
                  {sample.label}
                </span>
                <span className="text-[11px] font-mono text-[#718C85] block truncate mt-0.5">
                  {sample.url}
                </span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                  sample.type === "CRITICAL"
                    ? "bg-[#FF6474]/15 text-[#FF6474] border border-[#FF6474]/40 shadow-[0_0_10px_rgba(255,100,116,0.2)]"
                    : sample.type === "HIGH"
                    ? "bg-[#FFB454]/15 text-[#FFB454] border border-[#FFB454]/40"
                    : "bg-[#45D6A0]/15 text-[#45D6A0] border border-[#45D6A0]/40"
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
