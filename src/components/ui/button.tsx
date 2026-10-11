import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "cyan" | "liquid";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050814] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-xs gap-2 tracking-wide",
    lg: "px-6 py-3 text-sm gap-2.5 tracking-wide font-semibold",
  }[size];

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border border-cyan-400/40 shadow-[5px_7px_16px_rgba(2,6,18,0.7),0_0_18px_rgba(6,182,212,0.35),inset_2px_2px_4px_rgba(255,255,255,0.45),inset_-2px_-2px_4px_rgba(0,0,0,0.4)] focus:ring-cyan-500",
    cyan:
      "bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-300/50 shadow-[5px_7px_18px_rgba(2,6,18,0.75),0_0_20px_rgba(6,182,212,0.4),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.4)] focus:ring-cyan-400",
    liquid:
      "bg-[#081d38] hover:bg-[#0b2446] text-cyan-300 hover:text-white border border-cyan-400/40 shadow-[5px_7px_16px_rgba(2,6,18,0.7),inset_2px_2px_4px_rgba(0,240,255,0.25),inset_-2px_-2px_4px_rgba(0,0,0,0.4)] focus:ring-cyan-500",
    secondary:
      "bg-[#0d1a38] hover:bg-[#122248] text-slate-200 border border-white/10 shadow-[4px_6px_14px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.15),inset_-2px_-2px_4px_rgba(0,0,0,0.45)] focus:ring-slate-500",
    outline:
      "bg-[#081226] hover:bg-[#0c1a36] text-slate-300 hover:text-white border border-white/10 hover:border-cyan-500/40 shadow-[4px_6px_14px_rgba(2,6,18,0.6),inset_1.5px_1.5px_3px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.4)] focus:ring-cyan-500",
    danger:
      "bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white border border-rose-400/40 shadow-[5px_7px_16px_rgba(2,6,18,0.7),0_0_18px_rgba(244,63,94,0.35),inset_2px_2px_4px_rgba(255,255,255,0.45),inset_-2px_-2px_4px_rgba(0,0,0,0.4)] focus:ring-rose-500",
    ghost:
      "bg-transparent hover:bg-white/[0.06] text-slate-400 hover:text-slate-100 focus:ring-slate-500",
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
      {children}
    </button>
  );
}
