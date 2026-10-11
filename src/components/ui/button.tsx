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
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#030712] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-xs gap-2 tracking-wide",
    lg: "px-6 py-3 text-sm gap-2.5 tracking-wide font-semibold",
  }[size];

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:via-teal-400 hover:to-indigo-500 text-white border border-emerald-400/30 shadow-[0_0_24px_rgba(20,184,166,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] focus:ring-teal-400",
    cyan:
      "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white border border-teal-400/30 shadow-[0_0_20px_rgba(20,184,166,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] focus:ring-teal-400",
    liquid:
      "bg-[#0a1526]/80 hover:bg-[#0e1d35] text-teal-300 hover:text-white border border-teal-500/25 shadow-[0_0_16px_rgba(20,184,166,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] focus:ring-teal-500",
    secondary:
      "bg-[#091224]/80 hover:bg-[#0f1b34] text-slate-200 border border-white/[0.08] hover:border-emerald-500/30 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] focus:ring-slate-500",
    outline:
      "bg-[#070e1c]/70 hover:bg-[#0c162c] text-slate-300 hover:text-white border border-white/[0.08] hover:border-teal-400/30 backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] focus:ring-teal-500",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white border border-red-400/30 shadow-[0_2px_10px_rgba(239,68,68,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] focus:ring-red-500",
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
