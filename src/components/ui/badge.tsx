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
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#FF6474]/30 bg-[#FF6474]/15 text-[#FF6474] shadow-[0_1px_3px_rgba(0,0,0,0.3)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6474] animate-pulse" />
          {t("CRITICAL")}
        </span>
      );
    case "HIGH":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#FFB454]/30 bg-[#FFB454]/15 text-[#FFB454] shadow-[0_1px_3px_rgba(0,0,0,0.3)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFB454]" />
          {t("HIGH")}
        </span>
      );
    case "MEDIUM":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#F0D66B]/30 bg-[#F0D66B]/15 text-[#F0D66B] shadow-[0_1px_3px_rgba(0,0,0,0.3)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#F0D66B]" />
          {t("MEDIUM")}
        </span>
      );
    case "LOW":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#45D6A0]/30 bg-[#45D6A0]/15 text-[#45D6A0] shadow-[0_1px_3px_rgba(0,0,0,0.3)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#45D6A0]" />
          {t("LOW")}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border border-[#28504A] bg-[#112624] text-[#A0B8B2] shadow-[0_1px_3px_rgba(0,0,0,0.3)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#718C85]" />
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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00DCC2]/30 bg-[#00DCC2]/15 text-[#00DCC2] px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00DCC2] animate-pulse" />
          {t("NEW")}
        </span>
      );
    case "INVESTIGATING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB454]/30 bg-[#FFB454]/15 text-[#FFB454] px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFB454] animate-ping" />
          {t("INVESTIGATING")}
        </span>
      );
    case "ESCALATED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6474]/30 bg-[#FF6474]/15 text-[#FF6474] px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6474] animate-pulse" />
          {t("ESCALATED", "ESCALATED")}
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#45D6A0]/30 bg-[#45D6A0]/15 text-[#45D6A0] px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#45D6A0]" />
          {t("RESOLVED")}
        </span>
      );
    case "FALSE_POSITIVE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#28504A] bg-[#112624] text-[#718C85] px-2.5 py-0.5 text-xs font-mono font-semibold">
          {t("FALSE POSITIVE", "FALSE POSITIVE")}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#28504A] bg-[#112624] text-[#A0B8B2] px-2.5 py-0.5 text-xs font-mono font-semibold">
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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6474]/35 bg-[#FF6474]/15 text-[#FF6474] px-2.5 py-0.5 text-[11px] font-mono font-bold shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6474] animate-pulse" />
          {t("IoC MATCH", "IoC MATCH")}
        </span>
      );
    case "NO_MATCH":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#45D6A0]/35 bg-[#45D6A0]/15 text-[#45D6A0] px-2.5 py-0.5 text-[11px] font-mono font-bold shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#45D6A0]" />
          {t("CLEAN")}
        </span>
      );
    case "UNAVAILABLE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB454]/35 bg-[#FFB454]/15 text-[#FFB454] px-2.5 py-0.5 text-[11px] font-mono shadow-sm">
          {t("FEED OFFLINE", "FEED OFFLINE")}
        </span>
      );
    case "NOT_CONFIGURED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#28504A] bg-[#112624] text-[#718C85] px-2.5 py-0.5 text-[11px] font-mono">
          {t("OPTIONAL", "OPTIONAL")}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#28504A] bg-[#112624] text-[#718C85] px-2.5 py-0.5 text-[11px] font-mono">
          {t("INCONCLUSIVE", "INCONCLUSIVE")}
        </span>
      );
  }
}
