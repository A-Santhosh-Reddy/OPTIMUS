"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Terminal,
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Cpu,
  Layers,
  Menu,
} from "lucide-react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { NotificationCenter } from "./notification-center";
import { useLanguage } from "@/context/language-context";
import { Globe } from "lucide-react";

interface TopbarProps {
  userName?: string;
  organizationName?: string;
}

export function Topbar({ userName, organizationName = "Security Operations" }: TopbarProps) {
  const router = useRouter();
  const { language, setLanguage, t, availableLanguages, currentOption } = useLanguage();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSsrfModalOpen, setIsSsrfModalOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="h-14 sm:h-16 bg-[#042422]/95 backdrop-blur-md border-b border-[#193E39] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Navigation Drawer Toggle */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"))}
            className="md:hidden p-2 rounded-xl bg-[#082E2B] border border-[#193E39] text-[#00DCC2] hover:text-[#E7F4F1] transition-all shrink-0 shadow-[0_2px_8px_rgba(3,28,27,0.35)]"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <img
            src="/logo.png"
            alt="OPTIMUS Eagle Shield"
            className="h-6 w-6 sm:h-7 sm:w-7 object-contain filter drop-shadow-[0_2px_8px_rgba(0,220,194,0.3)] shrink-0"
          />
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#718C85] min-w-0">
            <span className="font-semibold text-[#E7F4F1] flex items-center gap-1.5 truncate">
              <ShieldCheck className="h-4 w-4 text-[#45D6A0] shrink-0 hidden sm:block" />
              <span className="truncate max-w-[110px] sm:max-w-none">{organizationName}</span>
            </span>
            <span className="text-[#28504A] hidden sm:inline">/</span>
            <span className="text-[#00DCC2] font-mono text-[10px] sm:text-[11px] bg-[#0B302D] px-2 py-0.5 rounded-full border border-[#28504A] hidden xs:flex items-center gap-1.5 shadow-[0_1px_4px_rgba(3,28,27,0.3)] shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00DCC2] animate-pulse" />
              <span className="hidden md:inline">{t("topbar.shield", "CYBER MATRIX SHIELD")}</span>
              <span className="md:hidden">ACTIVE</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Language Switcher Dropdown in Topbar */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#082E2B] border border-[#193E39] hover:border-[#28504A] text-[11px] font-mono text-[#E7F4F1] hover:text-[#00DCC2] transition-all cursor-pointer shadow-[0_2px_8px_rgba(3,28,27,0.35)]"
              title="Change Interface Language / Cambiar Idioma / Changer la Langue / Sprache Ändern"
            >
              <span className="text-xs">{currentOption.flag}</span>
              <span className="font-semibold uppercase tracking-wider">{currentOption.code}</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[#28504A] bg-[#0B302D] p-1.5 shadow-[0_12px_36px_rgba(3,28,27,0.85)] z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-mono text-[#718C85] px-2 py-1 uppercase tracking-wider border-b border-[#193E39]">
                  Select Language
                </div>
                <div className="space-y-0.5 mt-1 font-mono text-xs">
                  {availableLanguages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        language === l.code
                          ? "bg-[#163632] text-[#00DCC2] font-semibold border border-[#00DCC2]/40 shadow-sm"
                          : "text-[#A0B8B2] hover:bg-[#163632]/60 hover:text-[#E7F4F1]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span className="text-[11px] font-sans">{l.nativeName}</span>
                      </span>
                      {language === l.code && <span className="h-1.5 w-1.5 rounded-full bg-[#00DCC2]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive SSRF Status Pill Button */}
          <button
            type="button"
            onClick={() => setIsSsrfModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#082E2B] border border-[#28504A] text-[11px] text-[#00DCC2] hover:border-[#00DCC2]/40 hover:bg-[#0B302D] shadow-[0_2px_8px_rgba(3,28,27,0.35)] transition-all cursor-pointer group"
            title="Click to view SSRF Protection & Heuristic Engine telemetry"
          >
            <Terminal className="h-3.5 w-3.5 text-[#00DCC2] group-hover:rotate-6 transition-transform" />
            <span className="font-mono text-[10px] tracking-wide font-medium">
              {t("topbar.ssrfPill", "SSRF-SAFE LEXICAL ANALYSIS")}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#45D6A0] animate-pulse ml-0.5" />
          </button>

          {/* Real Security Notifications Center */}
          <NotificationCenter />

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            className="text-xs text-[#A0B8B2] border-[#28504A] hover:border-[#FF6474]/40 hover:text-[#FF6474] hover:bg-[#FF6474]/10"
          >
            <LogOut className="h-3.5 w-3.5 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">{t("topbar.signOut", "Sign Out")}</span>
          </Button>
        </div>
      </header>

      {/* SSRF Lexical Analysis Engine Telemetry Modal */}
      <Modal
        isOpen={isSsrfModalOpen}
        onClose={() => setIsSsrfModalOpen(false)}
        title="SSRF-SAFE LEXICAL ANALYSIS ENGINE"
        description="Autonomous deterministic threat inspection architecture & SSRF prevention telemetry."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2 text-[#E7F4F1]">
          {/* Engine Status Grid */}
          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#082E2B] border border-[#28504A] flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#45D6A0] flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[#718C85] uppercase">Engine Status</p>
                <p className="text-[#45D6A0] font-semibold text-xs mt-0.5">ACTIVE &bull; 100% ONLINE</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#082E2B] border border-[#28504A] flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-[#00DCC2] flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[#718C85] uppercase">SSRF Prevention</p>
                <p className="text-[#00DCC2] font-semibold text-xs mt-0.5">ZERO OUTBOUND FETCH</p>
              </div>
            </div>
          </div>

          {/* Architecture Explanation */}
          <div className="p-4 rounded-xl bg-[#082E2B] border border-[#193E39] space-y-2 text-xs leading-relaxed text-[#A0B8B2]">
            <h4 className="font-semibold text-[#E7F4F1] font-mono flex items-center gap-2 text-xs">
              <Cpu className="h-4 w-4 text-[#00DCC2]" />
              What is SSRF-Safe Lexical Analysis?
            </h4>
            <p>
              Traditional scanners often initiate blind HTTP/GET requests to target URLs, making servers vulnerable to 
              <span className="text-[#FF6474] font-mono"> Server-Side Request Forgery (SSRF)</span>, internal network port scanning, and cloud metadata theft (such as <code className="text-[#00DCC2] font-mono">169.254.169.254</code>).
            </p>
            <p>
              Optimus eliminates this vulnerability by executing <span className="text-[#00DCC2] font-semibold">100% offline lexical analysis</span>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#718C85] font-mono text-[11px] pl-1">
              <li><strong className="text-[#E7F4F1]">Zero Target Connections:</strong> Evaluates target URLs in memory without pinging target IPs.</li>
              <li><strong className="text-[#E7F4F1]">Shannon Entropy Analysis:</strong> Detects algorithmically generated domains (DGA) and credential theft slugs.</li>
              <li><strong className="text-[#E7F4F1]">Brand Homoglyph Detection:</strong> Flags Unicode confusables (e.g., Cyrillic 'а' replacing Latin 'a').</li>
              <li><strong className="text-[#E7F4F1]">Levenshtein Edit Distance:</strong> Automatically spots typosquats against your protected brand domains.</li>
              <li><strong className="text-[#E7F4F1]">Private IP Guard:</strong> Classifies raw IP hosts (`10.x`, `192.168.x`, `127.x`) as high-risk anomalies without sending packets.</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#193E39]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSsrfModalOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsSsrfModalOpen(false);
                router.push("/analyzer");
              }}
              className="text-xs shadow-md shadow-[#00DCC2]/20"
            >
              Open Threat Vector Analyzer
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
