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
    none: "border-[#193E39] hover:border-[#28504A]",
    cyber: "border-[#28504A] hover:border-[#00DCC2]/50 hover:shadow-[0_4px_24px_rgba(3,28,27,0.7),0_0_20px_rgba(0,220,194,0.08)]",
    cyan: "border-[#28504A] hover:border-[#00DCC2]/50 hover:shadow-[0_4px_24px_rgba(3,28,27,0.7),0_0_20px_rgba(0,220,194,0.08)]",
    blue: "border-[#193E39] hover:border-[#28504A]",
    emerald: "border-[#193E39] hover:border-[#45D6A0]/40",
    red: "border-[#193E39] hover:border-[#FF6474]/40",
    amber: "border-[#193E39] hover:border-[#FFB454]/40",
    purple: "border-[#193E39] hover:border-[#28504A]",
  }[glow];

  return (
    <div
      className={`rounded-xl p-5 sm:p-6 transition-all duration-200 bg-[#112624] text-[#E7F4F1] shadow-[0_4px_20px_-2px_rgba(3,28,27,0.6)] border ${glowClasses} ${className}`}
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
    <div className="flex items-start justify-between gap-4 border-b border-[#193E39] pb-4 mb-4 sm:mb-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B302D] border border-[#193E39] text-[#00DCC2] shadow-[0_2px_8px_rgba(3,28,27,0.4)]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[#E7F4F1] flex items-center gap-2">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-[#718C85] mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
