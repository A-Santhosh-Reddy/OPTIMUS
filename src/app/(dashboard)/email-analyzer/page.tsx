"use client";

import React, { useState } from "react";
import { Mail, ShieldAlert, Sparkles, Send, FileCode, CheckCircle2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmailResultCard } from "@/components/analyzer/email-result-card";
import { EmailHeaderAnalysisResult } from "@/lib/detection/email-header-parser";

const SAMPLE_PHISHING_HEADERS = `Delivered-To: victim@company.com
Received: by 2002:a05:6512:300f with SMTP id y15csp4791338lfv;
        Sat, 11 Oct 2026 09:12:30 -0700 (PDT)
X-Google-Smtp-Source: AGHT+IFg84k...
Received: from suspicious-mail-relay.xyz (suspicious-mail-relay.xyz. [198.51.100.42])
        by mx.google.com with ESMTP id m12si28913989ejw.120.2026.10.11.09.12.29;
        Sat, 11 Oct 2026 09:12:29 -0700 (PDT)
Received-SPF: fail (google.com: domain of billing@service-secure-login.xyz does not designate 198.51.100.42 as permitted sender) client-ip=198.51.100.42;
Authentication-Results: mx.google.com;
       dkim=fail header.i=@paypal.com header.s=202409 header.b=abc12345;
       spf=fail (google.com: domain of billing@service-secure-login.xyz does not designate 198.51.100.42 as permitted sender) smtp.mailfrom=billing@service-secure-login.xyz;
       dmarc=fail (p=REJECT sp=REJECT dis=NONE) header.from=paypal.com
From: "PayPal Account Security" <service@paypal.com>
Reply-To: security-team@fake-support-desk.top
Return-Path: <bounce@unregistered-spammer-domain.xyz>
To: <victim@company.com>
Subject: URGENT: Your PayPal account has been restricted - Verify immediately
Date: Sat, 11 Oct 2026 09:12:28 -0700
Message-ID: <20261011091228.123456@service-secure-login.xyz>
Content-Type: text/html; charset="UTF-8"

Please verify your credentials at https://paypal-account-security-update.xyz/login/verify.php`;

const SAMPLE_CLEAN_HEADERS = `Delivered-To: security@company.com
Received: by 2002:a05:6512:1234 with SMTP id ab12csp567890;
        Sat, 11 Oct 2026 10:00:00 -0700 (PDT)
Received: from mail-ed1-f65.google.com (mail-ed1-f65.google.com. [209.85.208.65])
        by mx.google.com with ESMTPS id x9si12345678qwe.2026.10.11.10.00.00;
        Sat, 11 Oct 2026 10:00:00 -0700 (PDT)
Received-SPF: pass (google.com: domain of notifications@github.com designates 209.85.208.65 as permitted sender) client-ip=209.85.208.65;
Authentication-Results: mx.google.com;
       dkim=pass header.i=@github.com header.s=pf2014 header.b=valid123;
       spf=pass (google.com: domain of notifications@github.com designates 209.85.208.65 as permitted sender);
       dmarc=pass (p=REJECT sp=REJECT) header.from=github.com
From: GitHub <notifications@github.com>
Reply-To: GitHub <notifications@github.com>
Return-Path: <notifications@github.com>
To: <security@company.com>
Subject: [GitHub] Security advisory notification for your repository
Date: Sat, 11 Oct 2026 10:00:00 -0700
Message-ID: <github/repo/commit/123456@github.com>`;

export default function EmailAnalyzerPage() {
  const [headers, setHeaders] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EmailHeaderAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!headers.trim()) {
      setError("Please paste raw email headers to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze/email-headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze email headers");
      }

      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during email header analysis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = (sample: string) => {
    setHeaders(sample);
    setError(null);
  };

  const handleClear = () => {
    setHeaders("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            EMAIL FORENSICS ENGINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
          Phishing Email Header Analyzer
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Deep forensic inspection of raw RFC 5322 email headers. Detects executive impersonation, spoofed
          domains, failed SPF/DKIM/DMARC authentication, suspicious relay hops, and embedded phishing URLs.
        </p>
      </div>

      {/* Input Card */}
      <Card glow="cyber" hudCorner={true}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="text-xs font-semibold text-slate-200 font-mono flex items-center gap-2">
              <FileCode className="h-4 w-4 text-cyan-400" />
              Raw Email Headers (RFC 5322)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_PHISHING_HEADERS)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-red-950/50 hover:bg-red-900/60 border border-red-500/30 text-red-300 transition-colors"
              >
                Load Phishing Sample
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_CLEAN_HEADERS)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 transition-colors"
              >
                Load Clean Sample
              </button>
              {headers && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder="Paste raw email headers here...&#10;&#10;Delivered-To: recipient@domain.com&#10;Received: from mail.server.com...&#10;From: sender@domain.com&#10;Subject: Urgent Update&#10;Authentication-Results: mx.google.com; spf=pass..."
            rows={10}
            className="w-full liquid-glass-input rounded-xl p-3.5 text-xs font-mono text-slate-200 bg-slate-950/80 border border-white/10 focus:border-cyan-400/60 transition-colors resize-y placeholder:text-slate-600"
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="cyan"
              size="md"
              onClick={handleAnalyze}
              disabled={isLoading || !headers.trim()}
              className="text-xs font-semibold px-6"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Running Email Forensics...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Analyze Email Headers
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="rounded-2xl border border-cyan-500/30 liquid-glass-card p-10 text-center animate-pulse hud-corner">
          <Mail className="h-10 w-10 mx-auto text-cyan-400 animate-bounce mb-3" />
          <h3 className="text-sm font-semibold text-slate-100 font-mono tracking-wide">
            Deconstructing Authentication & Transport Topology...
          </h3>
          <p className="text-xs text-cyan-300/60 font-mono mt-1">
            Parsing SPF records &bull; Validating DKIM signatures &bull; Tracing relay hops
          </p>
        </div>
      )}

      {/* Analysis Result */}
      {result && <EmailResultCard result={result} />}
    </div>
  );
}
