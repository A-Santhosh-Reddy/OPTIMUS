import React from "react";
import { Severity, IncidentStatus, IntelStatus } from "@/lib/constants";

interface SeverityBadgeProps {
  severity: Severity | string;
  size?: "sm" | "md" | "lg";
}

export function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
  const s = severity.toUpperCase();
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] font-mono font-bold tracking-wide",
    md: "px-2.5 py-1 text-xs font-mono font-bold tracking-wide",
    lg: "px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider",
  }[size];

  switch (s) {
    case "CRITICAL":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-[#220912] text-rose-300 shadow-[3px_5px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.22),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse shadow-[0_0_6px_#fb7185]" />
          CRITICAL
        </span>
      );
    case "HIGH":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-orange-500/50 bg-[#221207] text-orange-300 shadow-[3px_5px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.22),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_#fb923c]" />
          HIGH
        </span>
      );
    case "MEDIUM":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-[#201507] text-amber-300 shadow-[3px_5px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.22),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          MEDIUM
        </span>
      );
    case "LOW":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-[#081d38] text-cyan-300 shadow-[3px_5px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.22),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          LOW
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-[#0d1a38] text-slate-300 shadow-[3px_5px_12px_rgba(2,6,18,0.6),inset_1.5px_1.5px_3px_rgba(255,255,255,0.15),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.45)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          {s}
        </span>
      );
  }
}

export function StatusBadge({ status }: { status: IncidentStatus | string }) {
  const st = status.toUpperCase();
  switch (st) {
    case "NEW":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-[#081d38] text-cyan-300 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[3px_5px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.22),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)]">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" />
          NEW
        </span>
      );
    case "INVESTIGATING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-[#201507] text-amber-300 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[3px_5px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.22),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
          INVESTIGATING
        </span>
      );
    case "ESCALATED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-[#220912] text-rose-300 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[3px_5px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.22),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)]">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse shadow-[0_0_6px_#fb7185]" />
          ESCALATED
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-[#08211d] text-emerald-300 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[3px_5px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.22),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          RESOLVED
        </span>
      );
    case "FALSE_POSITIVE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/60 text-slate-400 px-2.5 py-0.5 text-xs font-mono font-semibold backdrop-blur-md">
          FALSE POSITIVE
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 text-slate-300 px-2.5 py-0.5 text-xs font-mono font-semibold backdrop-blur-md">
          {st}
        </span>
      );
  }
}

export function IntelStatusBadge({ status }: { status: IntelStatus | string }) {
  const is = status?.toUpperCase();
  switch (is) {
    case "MATCH_FOUND":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-950/70 text-red-300 px-2.5 py-0.5 text-[11px] font-mono font-bold backdrop-blur-md shadow-[0_0_10px_rgba(239,68,68,0.2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse shadow-[0_0_6px_#f87171]" />
          IoC MATCH
        </span>
      );
    case "NO_MATCH":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-950/60 text-emerald-300 px-2.5 py-0.5 text-[11px] font-mono font-bold backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          CLEAN
        </span>
      );
    case "UNAVAILABLE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-950/60 text-amber-300 px-2.5 py-0.5 text-[11px] font-mono backdrop-blur-md">
          FEED OFFLINE
        </span>
      );
    case "NOT_CONFIGURED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 text-slate-400 px-2.5 py-0.5 text-[11px] font-mono backdrop-blur-md">
          OPTIONAL
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 text-slate-400 px-2.5 py-0.5 text-[11px] font-mono backdrop-blur-md">
          INCONCLUSIVE
        </span>
      );
  }
}
