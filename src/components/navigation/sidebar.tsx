"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Search,
  Radio,
  FileCheck2,
  Shield,
  History,
  Activity,
  Cpu,
  Sparkles,
  Sliders,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Bell,
  Volume2,
  Palette,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Zap,
  KeyRound,
  Lock,
  Bot,
  SlidersHorizontal,
  Check,
  Globe,
  Gavel,
} from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { AiHelpAgent } from "../help/ai-help-agent";
import { EnterpriseLicenseModal } from "./enterprise-license-modal";
import { useLanguage } from "@/context/language-context";

interface SidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
  username?: string;
  organizationName?: string;
}

export function Sidebar({
  userRole = "ANALYST",
  userName = "Analyst",
  userEmail = "analyst@optimus-drp.io",
  username = "analyst_secops",
  organizationName = "CyberDefend Global Security Operations",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t, availableLanguages } = useLanguage();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "upgrade" | "personalization" | "profile" | "settings" | "help" | null
  >(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Settings State (Interactive)
  const [criticalThreshold, setCriticalThreshold] = useState(70);
  const [ssrfMode, setSsrfMode] = useState<"in-memory" | "sandboxed">("in-memory");
  const [shannonEntropy, setShannonEntropy] = useState(3.8);
  const [levenshteinMax, setLevenshteinMax] = useState(2);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Personalization State (Interactive)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cyberGridEnabled, setCyberGridEnabled] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState("30s");
  const [personalizationSaved, setPersonalizationSaved] = useState(false);

  // Help Desk Tab state
  const [helpTab, setHelpTab] = useState<"ai-copilot" | "hotkeys" | "ssrf">("ai-copilot");

  const menuRef = useRef<HTMLDivElement>(null);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("optimus_engine_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.criticalThreshold) setCriticalThreshold(parsed.criticalThreshold);
        if (parsed.shannonEntropy) setShannonEntropy(parsed.shannonEntropy);
        if (parsed.levenshteinMax) setLevenshteinMax(parsed.levenshteinMax);
        if (parsed.ssrfMode) setSsrfMode(parsed.ssrfMode);
      }

      const savedSound = localStorage.getItem("optimus_sound_enabled");
      if (savedSound !== null) setSoundEnabled(savedSound === "true");

      const savedGrid = localStorage.getItem("optimus_grid_enabled");
      if (savedGrid !== null) {
        const enabled = savedGrid === "true";
        setCyberGridEnabled(enabled);
        updateGridOverlay(enabled);
      }
    } catch {}
  }, []);

  // Update Cyber Grid DOM
  const updateGridOverlay = (enabled: boolean) => {
    const overlays = document.querySelectorAll(".cyber-grid-overlay");
    overlays.forEach((el) => {
      (el as HTMLElement).style.opacity = enabled ? "0.3" : "0";
    });
  };

  // Sound Synthesizer function
  const playTone = (frequency = 880, duration = 0.25) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log("Audio API not supported");
    }
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Ctrl + A / Cmd + A (when not typing in text field): jump to Threat Analyzer
      if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A") && !isInput) {
        e.preventDefault();
        playTone(1020, 0.2);
        router.push("/analyzer");
        return;
      }

      // Ctrl + P / Cmd + P: Trigger Print / Report export
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        // If on finding or incident page, allow browser print dialog smoothly
      }

      // Esc: Dismiss any open modal
      if (e.key === "Escape") {
        if (activeModal) {
          setActiveModal(null);
        }
        if (isUserMenuOpen) {
          setIsUserMenuOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, isUserMenuOpen, router, soundEnabled]);

  // Click outside to close user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

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

  const saveEngineSettings = () => {
    const settings = {
      criticalThreshold,
      ssrfMode,
      shannonEntropy,
      levenshteinMax,
    };
    try {
      localStorage.setItem("optimus_engine_settings", JSON.stringify(settings));
    } catch {}
    playTone(1200, 0.2);
    setSettingsSaved(true);
    setTimeout(() => {
      setSettingsSaved(false);
      setActiveModal(null);
    }, 1200);
  };

  const savePersonalization = () => {
    try {
      localStorage.setItem("optimus_sound_enabled", String(soundEnabled));
      localStorage.setItem("optimus_grid_enabled", String(cyberGridEnabled));
      localStorage.setItem("optimus_refresh_rate", autoRefreshInterval);
    } catch {}
    updateGridOverlay(cyberGridEnabled);
    playTone(960, 0.2);
    setPersonalizationSaved(true);
    setTimeout(() => {
      setPersonalizationSaved(false);
      setActiveModal(null);
    }, 1200);
  };

  const navItems = [
    {
      name: t("nav.dashboard", "Security Dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: t("nav.domains", "Domain Monitoring"),
      href: "/domains",
      icon: Globe,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: t("nav.takedowns", "Takedown Center"),
      href: "/takedowns",
      icon: Gavel,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: t("nav.analyzer", "URL & Threat Analyzer"),
      href: "/analyzer",
      icon: Search,
      roles: ["ADMIN", "ANALYST"],
    },
    {
      name: t("nav.findings", "Threat Findings"),
      href: "/findings",
      icon: ShieldAlert,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: t("nav.incidents", "Incident Cases"),
      href: "/incidents",
      icon: FileCheck2,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: t("nav.brands", "Brand Protection"),
      href: "/brands",
      icon: Shield,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: t("nav.threatIntel", "Threat Intelligence"),
      href: "/threat-intel",
      icon: Radio,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: t("nav.auditLogs", "Security Audit Logs"),
      href: "/audit-logs",
      icon: History,
      roles: ["ADMIN"],
    },
  ];

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <aside className="w-64 shrink-0 liquid-glass-sidebar flex flex-col justify-between h-screen fixed inset-y-0 left-0 z-30 select-none overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Brand Logo & Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-[#091530] border border-cyan-400/50 shadow-[0_0_18px_rgba(0,240,255,0.35),inset_1.5px_1.5px_3px_rgba(255,255,255,0.2)]">
              <img
                src="/logo.png"
                alt="OPTIMUS Cyber Defense"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-white flex items-center gap-1.5 font-mono">
                OPTIMUS{" "}
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/20">
                  DRP
                </span>
              </h1>
              <p className="text-[11px] text-cyan-300/70 font-medium tracking-tight">Cyber Defense Platform</p>
            </div>
          </div>

          {/* Live System Status Tag with Radar Pulse */}
          <div className="px-4 py-3">
            <div className="relative overflow-hidden flex items-center justify-between rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-blue-950/30 border border-cyan-500/20 px-3.5 py-2.5 text-xs shadow-inner">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm shadow-emerald-400" />
                </span>
                <span className="text-slate-200 font-semibold text-[11px] tracking-wide flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-cyan-400" />
                  {t("nav.heuristicCore", "Heuristic Core")}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                {t("nav.online", "ONLINE")}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-2">
            {navItems
              .filter((item) => item.roles.includes(userRole))
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 select-none ${
                      isActive
                        ? "bg-[#091e38] text-cyan-300 border border-cyan-400/40 shadow-[4px_6px_14px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(0,240,255,0.25),inset_-2px_-2px_4px_rgba(0,0,0,0.5)] font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-[#0c1834] hover:shadow-[3px_5px_10px_rgba(2,6,18,0.5),inset_1px_1px_2px_rgba(255,255,255,0.08)] border border-transparent hover:border-white/10"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors shrink-0 ${
                        isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-cyan-300"
                      }`}
                    />
                    <span className="tracking-wide font-plex-mono text-[11px] truncate">{item.name}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] shrink-0" />
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Info Pill & Interactive Dropdown Menu Container */}
        <div className="shrink-0 relative p-3 border-t border-white/[0.08] bg-[#050c1e]" ref={menuRef}>
          {/* The Rich Popup Dropdown (Matches Image 2) */}
          {isUserMenuOpen && (
            <div className="absolute bottom-[72px] left-3 right-3 rounded-2xl border border-cyan-500/40 bg-[#0d1a38] p-2.5 shadow-[12px_16px_36px_rgba(2,6,18,0.95),inset_2px_2px_4px_rgba(255,255,255,0.15),inset_-3px_-3px_6px_rgba(0,0,0,0.6)] z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {/* Header: User identity */}
              <div
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setActiveModal("profile");
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md border border-cyan-400/30 shrink-0">
                    {getInitials(userName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                      {userName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{userRole} &bull; Active</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
              </div>

              <div className="h-px bg-white/[0.08] my-1" />

              {/* Menu items */}
              <div className="space-y-0.5 text-xs text-slate-300 font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActiveModal("upgrade");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-cyan-300 transition-colors text-left"
                >
                  <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>{t("menu.upgrade", "Upgrade plan")}</span>
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                    PRO
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActiveModal("personalization");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-cyan-300 transition-colors text-left"
                >
                  <Sliders className="h-4 w-4 text-sky-400 shrink-0" />
                  <span>{t("menu.personalization", "Personalization")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActiveModal("profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-cyan-300 transition-colors text-left"
                >
                  <User className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>{t("menu.profile", "Profile")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActiveModal("settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-cyan-300 transition-colors text-left"
                >
                  <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{t("menu.settings", "Settings")}</span>
                </button>

                <div className="h-px bg-white/[0.08] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActiveModal("help");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-cyan-300 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Bot className="h-4 w-4 text-cyan-400 shrink-0 animate-pulse" />
                    <span className="font-semibold text-cyan-300">{t("menu.help", "Help Desk & AI Copilot")}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    AI AGENT
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>{isLoggingOut ? t("menu.loggingOut", "Signing out...") : t("menu.logout", "Log out")}</span>
                </button>
              </div>
            </div>
          )}

          {/* The Clickable User Pill Trigger (Matches image 1) */}
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-2xl border transition-all text-left group cursor-pointer ${
              isUserMenuOpen
                ? "bg-[#0c1a38] border-cyan-400/50 shadow-[6px_8px_20px_rgba(2,6,18,0.85),inset_2px_2px_4px_rgba(255,255,255,0.18)]"
                : "bg-[#081329] border-white/10 hover:border-cyan-400/40 hover:bg-[#0c1a38] shadow-[4px_6px_14px_rgba(2,6,18,0.7),inset_1.5px_1.5px_3px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.45)]"
            }`}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600/40 to-blue-500/30 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-300 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
                {userName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.2 rounded font-semibold tracking-wider">
                  {userRole}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>

      {/* ----------------- SUB-FEATURE MODALS ----------------- */}

      {/* Modal 1: Enterprise Platform License & Tier Management (Fully Interactive) */}
      <EnterpriseLicenseModal
        isOpen={activeModal === "upgrade"}
        onClose={() => setActiveModal(null)}
      />

      {/* Modal 2: Personalization / Preferences (Fully Interactive & Multilingual) */}
      <Modal
        isOpen={activeModal === "personalization"}
        onClose={() => setActiveModal(null)}
        title={t("personalization.title", "CYBER INTERFACE PERSONALIZATION")}
        description={t("personalization.desc", "Configure your SOC console language, audio, visuals, and telemetry preferences.")}
        maxWidth="md"
      >
        <div className="space-y-4 pt-1 text-slate-200 text-xs">
          {/* Multi-Language Selector (English, Spanish, French, German) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-cyan-400 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-100">{t("personalization.language", "Console Language")}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t("personalization.languageSub", "Select primary interface display locale")}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                {language.toUpperCase()}
              </span>
            </div>

            {/* 4 Supported Languages Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
              {availableLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      playTone(1050, 0.15);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold"
                        : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span className="text-[11px] font-sans">{lang.nativeName}</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Beep Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-100">{t("personalization.audio", "Audio Telemetry Cues")}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t("personalization.audioSub", "Play synthetic frequency beep on threat detection")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => playTone(880, 0.25)}
                className="text-[10px] font-mono px-2 py-1 rounded border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/50 cursor-pointer"
              >
                {t("personalization.testAudio", "Test")}
              </button>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-10 h-6 rounded-full transition-colors p-0.5 border cursor-pointer ${
                  soundEnabled ? "bg-cyan-600 border-cyan-400" : "bg-slate-800 border-slate-700"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    soundEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Cyber Grid Background */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <Palette className="h-4 w-4 text-purple-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-100">{t("personalization.grid", "Holographic Cyber Grid")}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t("personalization.gridSub", "Render matrix grid overlay in background")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !cyberGridEnabled;
                setCyberGridEnabled(next);
                updateGridOverlay(next);
              }}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 border cursor-pointer ${
                cyberGridEnabled ? "bg-cyan-600 border-cyan-400" : "bg-slate-800 border-slate-700"
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  cyberGridEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Telemetry Refresh Cadence */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-100">{t("personalization.refresh", "Telemetry Stream Refresh")}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t("personalization.refreshSub", "Dashboard live polling interval")}</p>
              </div>
            </div>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(e.target.value)}
              className="liquid-glass-input rounded-lg px-2.5 py-1 text-[11px] font-mono text-cyan-300 bg-slate-950"
            >
              <option value="15s">15 Seconds</option>
              <option value="30s">30 Seconds</option>
              <option value="60s">1 Minute</option>
            </select>
          </div>

          {personalizationSaved && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] animate-in fade-in">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>{t("personalization.saved", "Personalization preferences saved successfully!")}</span>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-white/[0.08]">
            <Button variant="cyan" size="sm" onClick={savePersonalization} className="text-xs">
              {t("personalization.save", "Save Preferences")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal 3: Analyst Profile & Identity */}
      <Modal
        isOpen={activeModal === "profile"}
        onClose={() => setActiveModal(null)}
        title="SECURITY ANALYST PROFILE"
        description="Active identity, access permissions, and cryptographic session details."
        maxWidth="md"
      >
        <div className="space-y-4 pt-1 text-slate-200 text-xs">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-base shadow-lg border border-cyan-400/40 shrink-0">
              {getInitials(userName)}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{userName}</h4>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{userEmail}</p>
              <span className="inline-block mt-1.5 text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                Role: {userRole}
              </span>
            </div>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/40 border border-white/[0.08] font-mono text-[11px]">
            <div className="flex items-center justify-between py-1 border-b border-white/[0.05]">
              <span className="text-slate-400">Username handle:</span>
              <span className="text-cyan-300 font-semibold">@{username}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.05]">
              <span className="text-slate-400">Organization:</span>
              <span className="text-slate-200">{organizationName}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.05]">
              <span className="text-slate-400">Session Protocol:</span>
              <span className="text-emerald-400">Signed JWT (HS-256)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Database Source:</span>
              <span className="text-blue-300">Enterprise MySQL / Supabase</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            <Link href="/audit-logs" onClick={() => setActiveModal(null)}>
              <Button variant="outline" size="sm" className="text-xs">
                <History className="h-3.5 w-3.5 mr-1.5" />
                My Audit Logs
              </Button>
            </Link>
            <Button variant="cyan" size="sm" onClick={() => setActiveModal(null)} className="text-xs">
              Close Profile
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal 4: Settings / Engine Config (Fully Interactive Inputs & Sliders) */}
      <Modal
        isOpen={activeModal === "settings"}
        onClose={() => setActiveModal(null)}
        title="SOC HEURISTIC ENGINE SETTINGS"
        description="Adjust detection rule parameters and risk score calibration."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-1 text-slate-200 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Critical Threshold Slider */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    Critical Threshold
                  </span>
                  <span className="text-base font-bold text-cyan-300 font-mono">
                    &gt;= {criticalThreshold} Points
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Triggers immediate takedown notice alert</p>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full mt-3 accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* SSRF Safety Mode Selector */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                    SSRF Safety Mode
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
                    {ssrfMode === "in-memory" ? "100% In-Memory" : "Strict Sandbox"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Zero outbound HTTP GET/POST to untrusted targets</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-3 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setSsrfMode("in-memory")}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    ssrfMode === "in-memory"
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold"
                      : "bg-slate-900 border-white/[0.08] text-slate-400"
                  }`}
                >
                  In-Memory Safe
                </button>
                <button
                  type="button"
                  onClick={() => setSsrfMode("sandboxed")}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    ssrfMode === "sandboxed"
                      ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold"
                      : "bg-slate-900 border-white/[0.08] text-slate-400"
                  }`}
                >
                  Sandboxed
                </button>
              </div>
            </div>

            {/* Shannon Entropy Slider */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                    Shannon Entropy Limit
                  </span>
                  <span className="text-base font-bold text-amber-300 font-mono">
                    &gt;= {shannonEntropy} bits
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Classifies randomized DGA and token strings</p>
              </div>
              <input
                type="range"
                min="2.5"
                max="4.5"
                step="0.1"
                value={shannonEntropy}
                onChange={(e) => setShannonEntropy(Number(e.target.value))}
                className="w-full mt-3 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Levenshtein Edit Distance Stepper */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">
                    Levenshtein Edit Max
                  </span>
                  <span className="text-base font-bold text-purple-300 font-mono">
                    &lt;= {levenshteinMax} Chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Fuzzy typosquatting brand matching range</p>
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-3 font-mono text-[10px]">
                {[1, 2, 3].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLevenshteinMax(val)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      levenshteinMax === val
                        ? "bg-purple-950/80 border-purple-500 text-purple-300 font-bold"
                        : "bg-slate-900 border-white/[0.08] text-slate-400"
                    }`}
                  >
                    {val} Char{val > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {settingsSaved && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] animate-in fade-in">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Configurations successfully applied to the detection engine!</span>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-white/[0.08]">
            <Button variant="cyan" size="sm" onClick={saveEngineSettings} className="text-xs">
              Apply Configurations
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal 5: Help Desk & Autonomous AI Agent (Tabs: AI Copilot, Hotkeys, SSRF) */}
      <Modal
        isOpen={activeModal === "help"}
        onClose={() => setActiveModal(null)}
        title="SOC HELP DESK & AI COPILOT"
        description="Autonomous AI cybersecurity assistance, keyboard shortcuts, and architecture."
        maxWidth="xl"
      >
        <div className="space-y-4 pt-1 text-slate-200 text-xs">
          {/* Top Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/80 border border-cyan-500/20">
            <button
              type="button"
              onClick={() => setHelpTab("ai-copilot")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                helpTab === "ai-copilot"
                  ? "bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot className="h-4 w-4 text-cyan-400" />
              <span>AI Cyber Copilot</span>
            </button>
            <button
              type="button"
              onClick={() => setHelpTab("hotkeys")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                helpTab === "hotkeys"
                  ? "bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="h-4 w-4 text-sky-400" />
              <span>Hotkeys &amp; Navigation</span>
            </button>
            <button
              type="button"
              onClick={() => setHelpTab("ssrf")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                helpTab === "ssrf"
                  ? "bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>SSRF Architecture</span>
            </button>
          </div>

          {/* TAB 1: AI Cyber Copilot */}
          {helpTab === "ai-copilot" && <AiHelpAgent />}

          {/* TAB 2: Operational Hotkeys */}
          {helpTab === "hotkeys" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20">
                <h4 className="font-bold text-white font-mono text-xs flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  Active Keyboard Navigation Shortcuts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 font-mono text-[11px]">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-white/[0.06]">
                    <span className="text-slate-300">Launch URL Analyzer</span>
                    <kbd className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                      Ctrl + A
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-white/[0.06]">
                    <span className="text-slate-300">Dismiss Modal Dialog</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/[0.1] text-[10px] font-bold">
                      Esc
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-white/[0.06]">
                    <span className="text-slate-300">Run Inspection</span>
                    <kbd className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                      Enter
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-white/[0.06]">
                    <span className="text-slate-300">Export Incident PDF</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/[0.1] text-[10px] font-bold">
                      Ctrl + P
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/[0.08] text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-200">Tip for SOC Analysts:</p>
                <p>
                  Press <kbd className="text-cyan-300 font-mono">Ctrl + A</kbd> from any dashboard view to immediately jump into the Threat Vector Analyzer without using your mouse.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: SSRF Safety Architecture */}
          {helpTab === "ssrf" && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 space-y-3 text-xs leading-relaxed">
              <h4 className="font-bold text-white font-mono text-xs flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                SSRF-Safe Lexical Inspection Guarantees
              </h4>
              <p className="text-slate-300">
                Optimus implements a zero-trust model for untrusted URLs:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 font-mono text-[11px] pl-1">
                <li><strong className="text-slate-200">Zero Target Sockets:</strong> The server never dispatches HTTP GET/POST or ICMP ping packets to target domains.</li>
                <li><strong className="text-slate-200">100% In-Memory Parsing:</strong> Analyzes Shannon entropy, Unicode confusables, and multi-tier subdomains purely in RAM.</li>
                <li><strong className="text-slate-200">Intranet Metadata Protection:</strong> Requests targeting <code className="text-cyan-300">169.254.169.254</code> or <code className="text-cyan-300">127.0.0.1</code> are immediately flagged as critical threats without contacting the IP.</li>
              </ul>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-white/[0.08]">
            <Button variant="cyan" size="sm" onClick={() => setActiveModal(null)} className="text-xs">
              Close Help Desk
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
