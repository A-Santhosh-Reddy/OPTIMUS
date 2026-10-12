"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface BatchUploadProps {
  onStartScan: (urls: string[], autoEscalate: boolean) => void;
  isLoading: boolean;
}

export function BatchUpload({ onStartScan, isLoading }: BatchUploadProps) {
  const [inputText, setInputText] = useState("");
  const [autoEscalate, setAutoEscalate] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseUrls = (text: string): string[] => {
    return text
      .split(/[\r\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && !u.startsWith("#"));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
      }
    };
    reader.readAsText(file);
  };

  const currentUrls = parseUrls(inputText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUrls.length === 0) return;
    onStartScan(currentUrls.slice(0, 500), autoEscalate);
  };

  const handleLoadDemo = () => {
    const demo = [
      "https://paypal-security-verification.xyz/login",
      "https://microsoft-online-365-portal.top/auth/verify",
      "https://appleid-support-icloud.online/account",
      "https://chase-bank-verify-profile.buzz/signin",
      "https://netflix-subscription-renew.biz/payment",
      "https://github.com",
      "https://google.com/search?q=cybersecurity",
      "https://bankofamerica-customer-alert.click/security",
    ].join("\n");
    setInputText(demo);
    setFileName("demo_threat_sample.txt");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* File Upload Zone */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-100">Upload CSV / TXT File</h4>
            <p className="text-[11px] text-slate-400">One URL per line or comma-separated (Max 500 URLs)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-mono"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            {fileName ? fileName : "Choose File"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadDemo}
            className="text-[11px] font-mono text-cyan-300 hover:text-cyan-200 border-cyan-500/30"
          >
            Load Sample
          </Button>
        </div>
      </div>

      {/* Manual Paste Textarea */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-semibold text-slate-300 font-mono">
            Or Paste URLs Directly ({currentUrls.length} detected)
          </label>
          {currentUrls.length > 500 && (
            <span className="text-[10px] text-amber-400 font-mono">
              Note: Capped at first 500 URLs
            </span>
          )}
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="https://suspicious-login.xyz&#10;https://bank-verification.top&#10;https://paypal-update.online..."
          rows={6}
          className="w-full liquid-glass-input rounded-xl p-3 text-xs font-mono text-slate-200 bg-slate-950/80 border border-white/10 focus:border-cyan-400/60 transition-colors resize-y placeholder:text-slate-600"
        />
      </div>

      {/* Options & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoEscalate}
            onChange={(e) => setAutoEscalate(e.target.checked)}
            className="rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30"
          />
          <span>Auto-create Incident Cases for CRITICAL findings</span>
        </label>

        <Button
          type="submit"
          variant="cyan"
          size="md"
          disabled={isLoading || currentUrls.length === 0}
          className="text-xs font-semibold px-6"
        >
          <Play className="h-4 w-4 mr-2" />
          {isLoading ? `Scanning Batch...` : `Analyze ${currentUrls.length} URLs`}
        </Button>
      </div>
    </form>
  );
}
