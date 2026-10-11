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
      iconBg: "bg-[#f0f2ff] border border-[#b4bce8] text-[#1e3a8a] shadow-[2px_3px_8px_rgba(30,58,138,0.15)]",
      valueColor: "text-[#1e3a8a]",
      hoverBorder: "hover:border-[#1e3a8a]",
    },
    cyan: {
      glow: "cyan" as const,
      iconBg: "bg-[#f0f2ff] border border-[#b4bce8] text-[#1e3a8a] shadow-[2px_3px_8px_rgba(30,58,138,0.15)]",
      valueColor: "text-[#1e3a8a]",
      hoverBorder: "hover:border-[#1e3a8a]",
    },
    red: {
      glow: "red" as const,
      iconBg: "bg-[#fdf2f0] border border-[#fca5a5] text-[#dc2626] shadow-[2px_3px_8px_rgba(220,38,38,0.15)]",
      valueColor: "text-[#dc2626]",
      hoverBorder: "hover:border-[#dc2626]",
    },
    amber: {
      glow: "amber" as const,
      iconBg: "bg-[#fffbeb] border border-[#fde68a] text-[#d97706] shadow-[2px_3px_8px_rgba(217,119,6,0.15)]",
      valueColor: "text-[#d97706]",
      hoverBorder: "hover:border-[#d97706]",
    },
    emerald: {
      glow: "emerald" as const,
      iconBg: "bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] shadow-[2px_3px_8px_rgba(21,128,61,0.15)]",
      valueColor: "text-[#15803d]",
      hoverBorder: "hover:border-[#15803d]",
    },
  }[variant];

  const content = (
    <Card
      glow={variantStyles.glow}
      className={`relative overflow-hidden group transition-all duration-200 h-full flex flex-col justify-between rounded-[24px] ${
        href ? `cursor-pointer ${variantStyles.hoverBorder} hover:-translate-y-1 hover:shadow-xl` : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold text-[#6070b0] uppercase tracking-widest font-mono truncate">
              {t(title)}
            </p>
            {href && (
              <ArrowUpRight className="h-3 w-3 text-[#6070b0] group-hover:text-[#1e3a8a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            )}
          </div>
          <h4 className={`text-3xl font-extrabold tracking-tight mt-2 font-mono ${variantStyles.valueColor}`}>
            {value}
          </h4>
          {subtitle && <p className="text-xs text-[#6070b0] mt-1.5 truncate">{t(subtitle)}</p>}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border ${variantStyles.iconBg} group-hover:scale-105 transition-transform duration-200`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-2 flex items-center justify-between border-t border-[#ccd0f4]/80">
          <p className="text-[11px] text-[#1e3a8a] font-mono flex items-center gap-1.5 bg-[#f0f2ff] border border-[#ccd0f4] px-2 py-0.5 rounded-[12px] w-fit font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1e3a8a]" />
            {t(trend)}
          </p>
          {href && (
            <span className="text-[10px] font-mono text-[#6070b0] group-hover:text-[#1e3a8a] transition-colors hidden sm:inline">
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
