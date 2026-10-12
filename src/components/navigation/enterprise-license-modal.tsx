"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Zap,
  CheckCircle2,
  Shield,
  KeyRound,
  Sparkles,
  BarChart3,
  Server,
  RefreshCw,
  Check,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Clock,
  Layers,
} from "lucide-react";

interface EnterpriseLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnterpriseLicenseModal({ isOpen, onClose }: EnterpriseLicenseModalProps) {
  const [licenseData, setLicenseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tiers" | "license-key">("tiers");

  // License Key Activation State
  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [isActivatingKey, setIsActivatingKey] = useState(false);
  const [keyFeedback, setKeyFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Switching Tier State
  const [isSwitchingTier, setIsSwitchingTier] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchLicenseData();
    }
  }, [isOpen]);

  const fetchLicenseData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/organization/license");
      const data = await res.json();
      if (res.ok) {
        setLicenseData(data);
      }
    } catch (err) {
      console.error("Failed to load license data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchTier = async (tierKey: string) => {
    setIsSwitchingTier(tierKey);
    setKeyFeedback(null);
    try {
      const res = await fetch("/api/organization/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setKeyFeedback({
          type: "success",
          message: data.message || `Successfully switched to ${tierKey} tier!`,
        });
        await fetchLicenseData();
      } else {
        setKeyFeedback({
          type: "error",
          message: data.error || "Failed to switch plan tier.",
        });
      }
    } catch (err: any) {
      setKeyFeedback({
        type: "error",
        message: err.message || "Failed to switch plan tier.",
      });
    } finally {
      setIsSwitchingTier(null);
    }
  };

  const handleActivateKey = async (e?: React.FormEvent, presetKey?: string) => {
    if (e) e.preventDefault();
    const keyToUse = presetKey || licenseKeyInput;
    if (!keyToUse.trim()) return;

    setIsActivatingKey(true);
    setKeyFeedback(null);
    try {
      const res = await fetch("/api/organization/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: keyToUse.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setKeyFeedback({
          type: "success",
          message: data.message || "License key cryptographically verified & activated!",
        });
        setLicenseKeyInput("");
        await fetchLicenseData();
      } else {
        setKeyFeedback({
          type: "error",
          message: data.error || "Invalid license key signature.",
        });
      }
    } catch (err: any) {
      setKeyFeedback({
        type: "error",
        message: err.message || "Network error during license activation.",
      });
    } finally {
      setIsActivatingKey(false);
    }
  };

  const currentTier = licenseData?.license?.tier || "ENTERPRISE";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ENTERPRISE DRP PLATFORM LICENSE & MATRIX"
      description="Active SOC operations subscription, cryptographically signed matrix entitlements, and live quota telemetry."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-1 text-slate-200">
        {/* Banner: Active License Status & Cryptographic Identity */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 border border-cyan-500/40 relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                    currentTier === "ENTERPRISE"
                      ? "bg-cyan-950 text-cyan-300 border-cyan-400"
                      : currentTier === "PROFESSIONAL"
                      ? "bg-blue-950 text-blue-300 border-blue-400"
                      : "bg-slate-800 text-slate-300 border-slate-600"
                  }`}
                >
                  Active Tier: {licenseData?.tierConfig?.name || "Enterprise Cyber Matrix"}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SLA 99.99% ONLINE
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1.5 font-mono">
                {licenseData?.license?.issuedTo || "CyberDefend Global Security Operations"}
              </h3>
              <p className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-2 mt-1">
                <span>Key: <strong className="text-cyan-400">{licenseData?.license?.licenseKey}</strong></span>
                <span>&bull;</span>
                <span>Node: <strong className="text-slate-300">{licenseData?.license?.nodeId}</strong></span>
              </p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Live Quota & Usage Telemetry Meters */}
        {licenseData?.usage && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Daily Scans Meter */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Daily Scans Used</span>
                <span className="text-cyan-400 font-bold">
                  {licenseData.usage.todayAnalysesCount} / {licenseData.usage.dailyScansLimit}
                </span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${licenseData.usage.dailyScansPercent}%` }}
                />
              </div>
            </div>

            {/* Brand Shields Meter */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Protected Brand Assets</span>
                <span className="text-emerald-400 font-bold">
                  {licenseData.usage.totalBrandsCount} / {licenseData.usage.maxBrandsLimit}
                </span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${licenseData.usage.brandsPercent}%` }}
                />
              </div>
            </div>

            {/* Threat Intel Feeds Quota */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Threat Feeds Enabled</span>
                <span className="text-blue-400 font-bold">
                  {licenseData.tierConfig.threatFeeds} of 4 Feeds
                </span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-blue-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(licenseData.tierConfig.threatFeeds / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Feedback message */}
        {keyFeedback && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in duration-200 ${
              keyFeedback.type === "success"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/60 border-red-500/40 text-red-300"
            }`}
          >
            {keyFeedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
            )}
            <span>{keyFeedback.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("tiers")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all font-mono ${
              activeTab === "tiers"
                ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tier Switcher & Entitlements
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("license-key")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all font-mono flex items-center gap-1.5 ${
              activeTab === "license-key"
                ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <KeyRound className="h-3 w-3" />
            Activate Custom License Key
          </button>
        </div>

        {/* Tab 1: Interactive Tier Switcher */}
        {activeTab === "tiers" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Community Tier Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  currentTier === "COMMUNITY"
                    ? "bg-slate-900/90 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    : "bg-[#070b14] border-slate-800/80 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white font-mono">Community Tier</h4>
                    {currentTier === "COMMUNITY" && (
                      <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">Open source baseline access</p>
                  <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      15 URL Lexical Scans / day
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      2 Protected Brand Assets
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      1 Threat Feed (Local Feed)
                    </li>
                  </ul>
                </div>
                <Button
                  variant={currentTier === "COMMUNITY" ? "outline" : "ghost"}
                  size="sm"
                  disabled={currentTier === "COMMUNITY" || isSwitchingTier === "COMMUNITY"}
                  onClick={() => handleSwitchTier("COMMUNITY")}
                  className="w-full text-[11px] py-1 h-auto"
                >
                  {currentTier === "COMMUNITY" ? "Current Plan" : "Switch to Community"}
                </Button>
              </div>

              {/* Professional Tier Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  currentTier === "PROFESSIONAL"
                    ? "bg-slate-900/90 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                    : "bg-[#070b14] border-slate-800/80 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white font-mono">Professional SOC</h4>
                    {currentTier === "PROFESSIONAL" && (
                      <span className="text-[9px] font-mono font-bold bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/40">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">Dedicated SecOps hunting team</p>
                  <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      250 Scans / day
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      10 Protected Brands
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      Google Safe Browsing &amp; Local
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      Executive PDF Reports
                    </li>
                  </ul>
                </div>
                <Button
                  variant={currentTier === "PROFESSIONAL" ? "outline" : "secondary"}
                  size="sm"
                  disabled={currentTier === "PROFESSIONAL" || isSwitchingTier === "PROFESSIONAL"}
                  onClick={() => handleSwitchTier("PROFESSIONAL")}
                  className="w-full text-[11px] py-1 h-auto"
                >
                  {currentTier === "PROFESSIONAL" ? "Current Plan" : "Switch to Professional"}
                </Button>
              </div>

              {/* Enterprise Cyber Matrix Card */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  currentTier === "ENTERPRISE"
                    ? "bg-slate-900/90 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : "bg-[#070b14] border-slate-800/80 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-cyan-300 font-mono">Enterprise Matrix</h4>
                    {currentTier === "ENTERPRISE" && (
                      <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">Complete cyber defense suite</p>
                  <ul className="text-[10px] text-slate-300 space-y-1 font-mono pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-cyan-400 font-bold" />
                      <strong>Unlimited URL Scans</strong>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-cyan-400 font-bold" />
                      <strong>Unlimited Brand Assets</strong>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-cyan-400 font-bold" />
                      <strong>All 4 Threat Intel Feeds</strong>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-cyan-400 font-bold" />
                      <strong>Forensic PDF &amp; Audit Logs</strong>
                    </li>
                  </ul>
                </div>
                <Button
                  variant={currentTier === "ENTERPRISE" ? "outline" : "cyan"}
                  size="sm"
                  disabled={currentTier === "ENTERPRISE" || isSwitchingTier === "ENTERPRISE"}
                  onClick={() => handleSwitchTier("ENTERPRISE")}
                  className="w-full text-[11px] py-1 h-auto font-semibold"
                >
                  {currentTier === "ENTERPRISE" ? "Current Plan Active" : "Activate Enterprise"}
                </Button>
              </div>
            </div>

            {/* Entitlement List */}
            <div className="space-y-2 pt-2 text-xs">
              <h4 className="font-semibold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                Verified Active Entitlements on this Node:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-white/[0.06]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Unlimited URL Lexical Scans</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-white/[0.06]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>10+ Detection Heuristics</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-white/[0.06]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Multi-Source Threat Intel Feeds (4 Adapters)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-white/[0.06]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Executive Forensic PDF Export</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-white/[0.06]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Protected Brand Typosquat Shields</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-white/[0.06]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>365-Day SOC Audit Trail Logging</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Activate Custom License Key */}
        {activeTab === "license-key" && (
          <div className="space-y-4 p-4 rounded-xl border border-slate-800 bg-[#070b14]">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-cyan-400" />
                Cryptographic License Key Activation
              </h4>
              <p className="text-[11px] text-slate-400">
                Enter your issued enterprise contract key to verify digital signature and bind this instance to your organization.
              </p>
            </div>

            <form onSubmit={(e) => handleActivateKey(e)} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Enterprise Platform License Key
                </label>
                <input
                  type="text"
                  value={licenseKeyInput}
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  placeholder="e.g. OPTM-ENT-2026-CYBER-MATRIX"
                  className="w-full rounded-xl border border-slate-700 bg-[#0c121e] px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span>Quick Test Keys:</span>
                <button
                  type="button"
                  onClick={() => handleActivateKey(undefined, "OPTM-ENT-2026-CYBER-MATRIX")}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                >
                  Enterprise Matrix Key
                </button>
                <button
                  type="button"
                  onClick={() => handleActivateKey(undefined, "OPTM-PRO-2026-SECOPS")}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700"
                >
                  Pro SOC Key
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="cyan"
                  size="sm"
                  isLoading={isActivatingKey}
                  className="text-xs font-semibold"
                >
                  Validate &amp; Activate License
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-white/[0.08] text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1 text-slate-400">
            <Server className="h-3.5 w-3.5 text-cyan-400" />
            Optimus DRP v2.0 Enterprise Engine
          </span>
          <Button variant="cyan" size="sm" onClick={onClose} className="text-xs font-semibold">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
