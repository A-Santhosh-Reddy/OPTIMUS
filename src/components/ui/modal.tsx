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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className={`w-full ${widthClasses} rounded-[24px] border border-[#ccd0f4] bg-[#f4f6ff] text-[#080f2a] p-6 sm:p-7 shadow-[16px_22px_45px_rgba(180,188,232,0.8),inset_2.5px_2.5px_5px_rgba(255,255,255,0.9),inset_-4px_-4px_8px_rgba(180,188,232,0.4)] max-h-[90vh] overflow-y-auto relative`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#ccd0f4] pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#080f2a] font-mono flex items-center gap-2">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#6070b0] mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-[12px] p-1.5 text-[#6070b0] hover:bg-[#f0f2ff] hover:text-[#080f2a] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
