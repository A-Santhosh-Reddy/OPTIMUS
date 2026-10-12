"use client";

import React from "react";
import { Severity, IncidentStatus, IntelStatus } from "@/lib/constants";
import { useLanguage } from "@/context/language-context";

interface SeverityBadgeProps {
  severity: Severity | string;
  size?: "sm" | "md" | "lg";
}

export function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
  const { t } = useLanguage();
  const s = (severity || "").toUpperCase();
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] font-mono font-bold tracking-wide",
    md: "px-2.5 py-1 text-xs font-mono font-bold tracking-wide",
    lg: "px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider",
  }[size];

  switch (s) {
    case "CRITICAL":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 text-rose-300 shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
          {t("CRITICAL")}
        </span>
      );
    case "HIGH":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-300 shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          {t("HIGH")}
        </span>
      );
    case "MEDIUM":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-yellow-500/25 bg-yellow-500/10 text-yellow-300 shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
          {t("MEDIUM")}
        </span>
      );
    case "LOW":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 text-sky-300 shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          {t("LOW")}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          {t(s)}
        </span>
      );
  }
}

export function StatusBadge({ status }: { status: IncidentStatus | string }) {
  const { t } = useLanguage();
  const st = (status || "").toUpperCase();
  switch (st) {
    case "NEW":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 bg-sky-500/10 text-sky-300 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
          {t("NEW")}
        </span>
      );
    case "INVESTIGATING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 text-amber-300 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
          {t("INVESTIGATING")}
        </span>
      );
    case "ESCALATED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 text-rose-300 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
          {t("ESCALATED", "ESCALATED")}
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t("RESOLVED")}
        </span>
      );
    case "FALSE_POSITIVE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-400 px-2.5 py-0.5 text-xs font-mono font-semibold">
          {t("FALSE POSITIVE", "FALSE POSITIVE")}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-300 px-2.5 py-0.5 text-xs font-mono font-semibold">
          {t(st)}
        </span>
      );
  }
}

export function IntelStatusBadge({ status }: { status: IntelStatus | string }) {
  const { t } = useLanguage();
  const is = (status || "").toUpperCase();
  switch (is) {
    case "MATCH_FOUND":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 px-2.5 py-0.5 text-[11px] font-mono font-bold shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          {t("IoC MATCH", "IoC MATCH")}
        </span>
      );
    case "NO_MATCH":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 text-[11px] font-mono font-bold shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t("CLEAN")}
        </span>
      );
    case "UNAVAILABLE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 px-2.5 py-0.5 text-[11px] font-mono shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
          {t("FEED OFFLINE", "FEED OFFLINE")}
        </span>
      );
    case "NOT_CONFIGURED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-400 px-2.5 py-0.5 text-[11px] font-mono">
          {t("OPTIONAL", "OPTIONAL")}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-400 px-2.5 py-0.5 text-[11px] font-mono">
          {t("INCONCLUSIVE", "INCONCLUSIVE")}
        </span>
      );
  }
}
