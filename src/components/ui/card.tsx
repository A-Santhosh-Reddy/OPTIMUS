import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "blue" | "cyan" | "red" | "amber" | "emerald" | "purple" | "cyber" | "none";
  hudCorner?: boolean;
}

export function Card({
  children,
  glow = "none",
  hudCorner = false,
  className = "",
  ...props
}: CardProps) {
  const glowClasses = {
    none: "clay-card",
    cyber: "clay-card-cyan",
    cyan: "clay-card-cyan",
    blue: "clay-card-indigo",
    emerald: "clay-card-emerald",
    red: "clay-card-rose",
    amber: "clay-card-amber",
    purple: "clay-card-purple",
  }[glow];

  return (
    <div
      className={`rounded-[24px] p-6 transition-all duration-300 ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: any;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#ccd0f4]/80 pb-4 mb-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#f0f2ff] border border-[#ccd0f4] text-[#1e3a8a] shadow-[3px_4px_10px_rgba(180,188,232,0.4),inset_1.5px_1.5px_3px_rgba(255,255,255,0.9)]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[#080f2a] flex items-center gap-2">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-[#6070b0] mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
