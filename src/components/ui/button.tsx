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
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090d16] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-xs gap-2 tracking-wide",
    lg: "px-6 py-3 text-sm gap-2.5 tracking-wide font-semibold",
  }[size];

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30 shadow-[0_2px_10px_rgba(37,99,235,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] focus:ring-blue-500",
    cyan:
      "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white border border-sky-400/30 shadow-[0_2px_10px_rgba(56,189,248,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] focus:ring-sky-400",
    liquid:
      "bg-[#0e172a] hover:bg-[#13203c] text-sky-300 hover:text-white border border-sky-500/25 shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] focus:ring-sky-500",
    secondary:
      "bg-[#101728] hover:bg-[#16223b] text-slate-200 border border-white/[0.08] hover:border-white/[0.14] shadow-[0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] focus:ring-slate-500",
    outline:
      "bg-[#0c1220]/70 hover:bg-[#11192e] text-slate-300 hover:text-white border border-white/[0.08] hover:border-sky-500/30 shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] focus:ring-sky-500",
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
