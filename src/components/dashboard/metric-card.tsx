import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "../ui/card";
import { useLanguage } from "@/context/language-context";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: any;
  trend?: string;
  variant?: "blue" | "red" | "amber" | "cyan" | "emerald";
  href?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "blue",
  href,
}: MetricCardProps) {
  const { t } = useLanguage();
  const variantStyles = {
    blue: {
      glow: "blue" as const,
      iconBg: "bg-[#0a1b38] border border-blue-500/35 text-blue-300 shadow-[3px_4px_10px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.15)]",
      valueColor: "text-blue-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]",
      hoverBorder: "hover:border-blue-400/60",
    },
    cyan: {
      glow: "cyan" as const,
      iconBg: "bg-[#082238] border border-cyan-400/40 text-cyan-300 shadow-[3px_4px_10px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(0,240,255,0.25)]",
      valueColor: "text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.35)]",
      hoverBorder: "hover:border-cyan-400/60",
    },
    red: {
      glow: "red" as const,
      iconBg: "bg-[#240a14] border border-rose-500/40 text-rose-300 shadow-[3px_4px_10px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.15)]",
      valueColor: "text-rose-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.35)]",
      hoverBorder: "hover:border-rose-400/60",
    },
    amber: {
      glow: "amber" as const,
      iconBg: "bg-[#241707] border border-amber-500/40 text-amber-300 shadow-[3px_4px_10px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.15)]",
      valueColor: "text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.35)]",
      hoverBorder: "hover:border-amber-400/60",
    },
    emerald: {
      glow: "emerald" as const,
      iconBg: "bg-[#082420] border border-emerald-500/40 text-emerald-300 shadow-[3px_4px_10px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.15)]",
      valueColor: "text-emerald-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]",
      hoverBorder: "hover:border-emerald-400/60",
    },
  }[variant];

  const content = (
    <Card
      glow={variantStyles.glow}
      className={`relative overflow-hidden group transition-all duration-200 h-full flex flex-col justify-between ${
        href ? `cursor-pointer ${variantStyles.hoverBorder} hover:-translate-y-1 hover:shadow-xl` : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-mono truncate">
              {t(title)}
            </p>
            {href && (
              <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            )}
          </div>
          <h4 className={`text-3xl font-extrabold tracking-tight mt-2 font-mono ${variantStyles.valueColor}`}>
            {value}
          </h4>
          {subtitle && <p className="text-xs text-slate-400 mt-1.5 truncate">{t(subtitle)}</p>}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${variantStyles.iconBg} group-hover:scale-105 transition-transform duration-200`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-2 flex items-center justify-between border-t border-white/[0.05]">
          <p className="text-[11px] text-cyan-300/80 font-mono flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md w-fit">
            <span className="h-1 w-1 rounded-full bg-cyan-400" />
            {t(trend)}
          </p>
          {href && (
            <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors hidden sm:inline">
              {t("View page →")}
            </span>
          )}
        </div>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
