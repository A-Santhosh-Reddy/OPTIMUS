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
      className={`rounded-2xl p-6 transition-all duration-300 ${glowClasses} ${className}`}
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
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4 mb-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#091226] border border-white/10 text-cyan-400 shadow-[4px_6px_12px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.15)]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
