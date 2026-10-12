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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#062321] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs gap-2 tracking-wide",
    lg: "px-5.5 py-2.5 text-sm gap-2.5 tracking-wide font-semibold",
  }[size];

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#00DCC2] to-[#00BFA9] hover:brightness-110 text-[#031C1B] font-semibold border border-[#00DCC2]/40 shadow-[0_0_16px_rgba(0,220,194,0.25)] focus:ring-[#00DCC2]",
    cyan:
      "bg-[#00DCC2] hover:bg-[#20F5DB] text-[#031C1B] font-semibold border border-[#00DCC2]/50 shadow-[0_0_16px_rgba(0,220,194,0.25)] focus:ring-[#00DCC2]",
    liquid:
      "bg-[#0B302D] hover:bg-[#163632] text-[#00DCC2] hover:text-[#20F5DB] border border-[#28504A] hover:border-[#00DCC2]/40 shadow-sm focus:ring-[#00DCC2]",
    secondary:
      "bg-[#0B302D] hover:bg-[#163632] text-[#E7F4F1] border border-[#28504A] hover:border-[#00DCC2]/30 shadow-sm focus:ring-[#28504A]",
    outline:
      "bg-transparent hover:bg-[#0B302D] text-[#A0B8B2] hover:text-[#E7F4F1] border border-[#28504A] hover:border-[#00DCC2]/40 focus:ring-[#00DCC2]",
    danger:
      "bg-gradient-to-r from-[#FF6474] to-[#e04557] hover:brightness-110 text-white border border-[#FF6474]/40 shadow-[0_0_16px_rgba(255,100,116,0.2)] focus:ring-[#FF6474]",
    ghost:
      "bg-transparent hover:bg-[#0B302D] text-[#718C85] hover:text-[#E7F4F1] focus:ring-[#193E39]",
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
