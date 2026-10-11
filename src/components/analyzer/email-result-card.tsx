"use client";

import React from "react";
import {
  Mail,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Server,
  KeyRound,
  FileText,
  UserX,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { SeverityBadge } from "../ui/badge";
import { EmailHeaderAnalysisResult } from "@/lib/detection/email-header-parser";
import Link from "next/link";

interface EmailResultCardProps {
  result: EmailHeaderAnalysisResult;
}

export function EmailResultCard({ result }: EmailResultCardProps) {
  const { sender, authentication, relayHops, relayAnalysis, extractedUrls, riskIndicators, overallRisk, riskScore } =
    result;

  const getAuthBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
            <CheckCircle2 className="h-3 w-3" /> PASS
          </span>
        );
      case "FAIL":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded">
            <XCircle className="h-3 w-3" /> FAIL
          </span>
        );
      case "SOFTFAIL":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">
            <AlertTriangle className="h-3 w-3" /> SOFTFAIL
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Risk Banner */}
      <Card
        glow={overallRisk === "CRITICAL" ? "red" : overallRisk === "HIGH" ? "amber" : "cyan"}
        className="border-white/10"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${
                overallRisk === "CRITICAL" || overallRisk === "HIGH"
                  ? "bg-red-950/50 border-red-500/40 text-red-400"
                  : overallRisk === "MEDIUM"
                  ? "bg-amber-950/50 border-amber-500/40 text-amber-400"
                  : "bg-emerald-950/50 border-emerald-500/40 text-emerald-400"
              }`}
            >
              {overallRisk === "CRITICAL" || overallRisk === "HIGH" ? (
                <ShieldAlert className="h-6 w-6" />
              ) : (
                <ShieldCheck className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={overallRisk} />
                <span className="text-xs text-slate-400 font-mono">
                  SPF/DKIM/DMARC: {authentication.overallVerdict}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {result.subject || "No Subject Specified"}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                From: <span className="text-cyan-300">{sender.from || "Unknown"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-white">
                {riskScore}
                <span className="text-xs text-slate-400">/100</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Phishing Risk Score</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Sender Spoofing Alert */}
      {sender.isSpoofed && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
          <UserX className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-300 text-sm">Header Impersonation / Spoofing Detected</h4>
            <p className="mt-1">{sender.spoofDetails}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono text-[11px] bg-red-950/70 p-2.5 rounded-lg border border-red-800/40">
              <div>
                <span className="text-red-400">From: </span>
                <span>{sender.from}</span>
              </div>
              <div>
                <span className="text-red-400">Reply-To: </span>
                <span>{sender.replyTo || "None"}</span>
              </div>
              <div>
                <span className="text-red-400">Return-Path: </span>
                <span>{sender.returnPath || "None"}</span>
              </div>
              <div>
                <span className="text-red-400">Envelope-From: </span>
                <span>{sender.envelopeFrom || "None"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Authentication Breakdown & Relay Path */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Authentication Protocols */}
        <Card>
          <CardHeader
            title="Cryptographic Authentication Status"
            description="Sender Policy Framework, DomainKeys Identified Mail, and DMARC alignment"
            icon={KeyRound}
          />
          <div className="space-y-3 text-xs">
            {/* SPF */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">SPF (Sender Policy Framework)</span>
                  {getAuthBadge(authentication.spf.status)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">{authentication.spf.details}</p>
              </div>
            </div>

            {/* DKIM */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">DKIM (Cryptographic Signature)</span>
                  {getAuthBadge(authentication.dkim.status)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">{authentication.dkim.details}</p>
              </div>
            </div>

            {/* DMARC */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">DMARC Policy Enforcement</span>
                  {getAuthBadge(authentication.dmarc.status)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">{authentication.dmarc.details}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Relay Path Hops */}
        <Card>
          <CardHeader
            title={`Mail Transport Relay Path (${relayAnalysis.totalHops} Hops)`}
            description="Originating mail transfer agents and transit infrastructure"
            icon={Server}
          />
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 text-xs">
            {relayHops.length === 0 ? (
              <p className="text-slate-500 font-mono text-[11px] p-4 text-center">No Received: headers identified</p>
            ) : (
              relayHops.map((hop, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border font-mono text-[11px] ${
                    hop.isSuspicious
                      ? "bg-red-950/40 border-red-500/40 text-red-200"
                      : "bg-slate-950/60 border-white/[0.08] text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">Hop #{hop.index + 1}</span>
                    {hop.isSuspicious && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 font-bold">
                        SUSPICIOUS
                      </span>
                    )}
                  </div>
                  <div className="mt-1 truncate">
                    <span className="text-slate-500">From: </span>
                    <span>{hop.from}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">By: </span>
                    <span>{hop.by}</span>
                  </div>
                  {hop.suspiciousReason && (
                    <p className="text-red-400 text-[10px] mt-1">{hop.suspiciousReason}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Extracted URLs from headers */}
      {extractedUrls && extractedUrls.length > 0 && (
        <Card>
          <CardHeader
            title={`Extracted Embedded URLs (${extractedUrls.length})`}
            description="Discovered link targets that can be auto-scanned with OPTIMUS URL engine"
            icon={Layers}
          />
          <div className="space-y-2">
            {extractedUrls.map((url, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs font-mono"
              >
                <span className="text-cyan-300 truncate max-w-[80%]" title={url}>
                  {url}
                </span>
                <Link
                  href={`/analyzer?url=${encodeURIComponent(url)}`}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-500/30 shrink-0 font-sans font-semibold"
                >
                  Analyze Link <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Risk Indicators Table */}
      {riskIndicators && riskIndicators.length > 0 && (
        <Card>
          <CardHeader
            title="Email Forensic Indicators Flagged"
            description="Contributing penalty items according to standard RFC security requirements"
            icon={FileText}
          />
          <div className="space-y-2 text-xs">
            {riskIndicators.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-3 rounded-lg bg-slate-950/60 border border-white/[0.08]"
              >
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{item.title}</span>
                    <SeverityBadge severity={item.severity} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.description}</p>
                </div>
                <span className="font-mono font-bold text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded shrink-0">
                  +{item.points} pts
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
