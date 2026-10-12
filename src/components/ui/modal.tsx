"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#031C1B]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full ${widthClasses} rounded-2xl border border-[#28504A] bg-[#0B302D] p-5 sm:p-7 shadow-[0_24px_60px_rgba(3,28,27,0.95)] max-h-[90vh] overflow-y-auto relative`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#193E39] pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#E7F4F1] font-mono flex items-center gap-2">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#718C85] mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#718C85] hover:bg-[#163632] hover:text-[#00DCC2] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
