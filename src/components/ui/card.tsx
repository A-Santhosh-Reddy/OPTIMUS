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
    none: "border-sky-500/15 hover:border-sky-500/30",
    cyber: "border-cyan-500/35 shadow-liquid-cyan hover:border-cyan-400/60",
    cyan: "border-cyan-500/30 shadow-liquid-cyan hover:border-cyan-400/50",
    blue: "border-sky-500/30 shadow-liquid-blue hover:border-sky-400/50",
    emerald: "border-emerald-500/30 shadow-liquid-emerald hover:border-emerald-400/50",
    red: "border-red-500/30 shadow-liquid-red hover:border-red-400/50",
    amber: "border-amber-500/30 hover:border-amber-400/50",
    purple: "border-purple-500/30 shadow-liquid-purple hover:border-purple-400/50",
  }[glow];

  return (
    <div
      className={`liquid-glass-card rounded-2xl p-6 ${glowClasses} ${hudCorner ? "hud-corner" : ""} ${className}`}
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 text-cyan-400 shadow-inner">
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
