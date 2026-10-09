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
      "cyber-shimmer bg-gradient-to-r from-blue-600/90 to-cyan-500/90 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40 backdrop-blur-md focus:ring-cyan-500",
    cyan:
      "cyber-shimmer bg-gradient-to-r from-cyan-600/90 via-sky-500/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 border border-cyan-300/40 backdrop-blur-md focus:ring-cyan-400",
    liquid:
      "liquid-glass hover:bg-white/[0.08] text-cyan-300 hover:text-white border border-cyan-500/30 shadow-liquid-cyan hover:border-cyan-400/60 focus:ring-cyan-500",
    secondary:
      "bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 backdrop-blur-md focus:ring-slate-500",
    outline:
      "bg-slate-950/40 hover:bg-cyan-950/30 text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 backdrop-blur-md focus:ring-cyan-500",
    danger:
      "cyber-shimmer bg-gradient-to-r from-red-600/90 to-rose-700/90 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-600/25 border border-red-500/40 backdrop-blur-md focus:ring-red-500",
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
