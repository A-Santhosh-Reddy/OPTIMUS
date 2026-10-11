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
        <span className={`inline-flex items-center gap-1.5 rounded-[12px] border border-[#fca5a5] bg-[#fdf2f0] text-[#dc2626] font-bold shadow-[2px_3px_8px_rgba(220,38,38,0.15)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626] animate-pulse" />
          {t("CRITICAL")}
        </span>
      );
    case "HIGH":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-[12px] border border-[#fed7aa] bg-[#fff7ed] text-[#ea580c] font-bold shadow-[2px_3px_8px_rgba(234,88,12,0.15)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
          {t("HIGH")}
        </span>
      );
    case "MEDIUM":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-[12px] border border-[#fde68a] bg-[#fffbeb] text-[#d97706] font-bold shadow-[2px_3px_8px_rgba(217,119,6,0.15)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
          {t("MEDIUM")}
        </span>
      );
    case "LOW":
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-[12px] border border-[#b4bce8] bg-[#f0f2ff] text-[#1e3a8a] font-bold shadow-[2px_3px_8px_rgba(30,58,138,0.15)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#1e3a8a]" />
          {t("LOW")}
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-[12px] border border-[#ccd0f4] bg-[#f4f6ff] text-[#6070b0] font-bold shadow-[2px_3px_8px_rgba(180,188,232,0.2)] ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#6070b0]" />
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
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#b4bce8] bg-[#f0f2ff] text-[#1e3a8a] px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[2px_3px_8px_rgba(30,58,138,0.15)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1e3a8a] animate-pulse" />
          {t("NEW")}
        </span>
      );
    case "INVESTIGATING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#fde68a] bg-[#fffbeb] text-[#d97706] px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[2px_3px_8px_rgba(217,119,6,0.15)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d97706] animate-ping" />
          {t("INVESTIGATING")}
        </span>
      );
    case "ESCALATED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#fca5a5] bg-[#fdf2f0] text-[#dc2626] px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[2px_3px_8px_rgba(220,38,38,0.15)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626] animate-pulse" />
          {t("ESCALATED", "ESCALATED")}
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] px-2.5 py-0.5 text-xs font-mono font-bold tracking-wide shadow-[2px_3px_8px_rgba(21,128,61,0.15)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#15803d]" />
          {t("RESOLVED")}
        </span>
      );
    case "FALSE_POSITIVE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#ccd0f4] bg-[#f4f6ff] text-[#6070b0] px-2.5 py-0.5 text-xs font-mono font-semibold">
          {t("FALSE POSITIVE", "FALSE POSITIVE")}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#ccd0f4] bg-[#f4f6ff] text-[#080f2a] px-2.5 py-0.5 text-xs font-mono font-semibold">
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
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#fca5a5] bg-[#fdf2f0] text-[#dc2626] px-2.5 py-0.5 text-[11px] font-mono font-bold shadow-[2px_3px_8px_rgba(220,38,38,0.15)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626] animate-pulse" />
          {t("IoC MATCH", "IoC MATCH")}
        </span>
      );
    case "NO_MATCH":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] px-2.5 py-0.5 text-[11px] font-mono font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-[#15803d]" />
          {t("CLEAN")}
        </span>
      );
    case "UNAVAILABLE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#fde68a] bg-[#fffbeb] text-[#d97706] px-2.5 py-0.5 text-[11px] font-mono font-bold">
          {t("FEED OFFLINE", "FEED OFFLINE")}
        </span>
      );
    case "NOT_CONFIGURED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#ccd0f4] bg-[#f4f6ff] text-[#6070b0] px-2.5 py-0.5 text-[11px] font-mono">
          {t("OPTIONAL", "OPTIONAL")}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-[12px] border border-[#ccd0f4] bg-[#f4f6ff] text-[#6070b0] px-2.5 py-0.5 text-[11px] font-mono">
          {t("INCONCLUSIVE", "INCONCLUSIVE")}
        </span>
      );
  }
}
