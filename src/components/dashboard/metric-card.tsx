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
  variant = "cyan",
  href,
}: MetricCardProps) {
  const { t } = useLanguage();
  const variantStyles = {
    blue: {
      glow: "cyber" as const,
      iconBg: "bg-[#0B302D] border border-[#28504A] text-[#00DCC2]",
      valueColor: "text-[#E7F4F1]",
      hoverBorder: "hover:border-[#00DCC2]/40",
    },
    cyan: {
      glow: "cyber" as const,
      iconBg: "bg-[#0B302D] border border-[#28504A] text-[#00DCC2]",
      valueColor: "text-[#E7F4F1]",
      hoverBorder: "hover:border-[#00DCC2]/40",
    },
    red: {
      glow: "red" as const,
      iconBg: "bg-[#0B302D] border border-[#FF6474]/30 text-[#FF6474]",
      valueColor: "text-[#FF6474]",
      hoverBorder: "hover:border-[#FF6474]/40",
    },
    amber: {
      glow: "amber" as const,
      iconBg: "bg-[#0B302D] border border-[#FFB454]/30 text-[#FFB454]",
      valueColor: "text-[#FFB454]",
      hoverBorder: "hover:border-[#FFB454]/40",
    },
    emerald: {
      glow: "emerald" as const,
      iconBg: "bg-[#0B302D] border border-[#45D6A0]/30 text-[#45D6A0]",
      valueColor: "text-[#45D6A0]",
      hoverBorder: "hover:border-[#45D6A0]/40",
    },
  }[variant];

  const content = (
    <Card
      glow={variantStyles.glow}
      className={`relative overflow-hidden group transition-all duration-200 h-full flex flex-col justify-between ${
        href ? `cursor-pointer ${variantStyles.hoverBorder} hover:-translate-y-0.5 hover:shadow-lg` : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold text-[#718C85] uppercase tracking-wider font-mono truncate">
              {t(title)}
            </p>
            {href && (
              <ArrowUpRight className="h-3 w-3 text-[#718C85] group-hover:text-[#00DCC2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            )}
          </div>
          <h4 className={`text-3xl font-extrabold tracking-tight mt-2 font-mono ${variantStyles.valueColor}`}>
            {value}
          </h4>
          {subtitle && <p className="text-xs text-[#A0B8B2] mt-1.5 truncate">{t(subtitle)}</p>}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${variantStyles.iconBg} shadow-sm group-hover:scale-105 transition-transform duration-200`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-2.5 flex items-center justify-between border-t border-[#193E39]">
          <p className="text-[11px] text-[#00DCC2] font-mono flex items-center gap-1.5 bg-[#082E2B] border border-[#193E39] px-2 py-0.5 rounded-md w-fit">
            <span className="h-1 w-1 rounded-full bg-[#00DCC2]" />
            {t(trend)}
          </p>
          {href && (
            <span className="text-[10px] font-mono text-[#718C85] group-hover:text-[#00DCC2] transition-colors hidden sm:inline">
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
