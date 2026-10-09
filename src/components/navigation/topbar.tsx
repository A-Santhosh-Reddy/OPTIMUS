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
} from "lucide-react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

interface TopbarProps {
  userName?: string;
  organizationName?: string;
}

export function Topbar({ userName, organizationName = "Security Operations" }: TopbarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSsrfModalOpen, setIsSsrfModalOpen] = useState(false);

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
      <header className="h-16 liquid-glass-header px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">{organizationName}</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-mono text-[11px] bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.15)] flex-shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              CYBER MATRIX SHIELD
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Interactive SSRF Status Pill Button */}
          <button
            type="button"
            onClick={() => setIsSsrfModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-[11px] text-cyan-300 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-950/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer group"
            title="Click to view SSRF Protection & Heuristic Engine telemetry"
          >
            <Terminal className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-6 transition-transform" />
            <span className="font-mono text-[10px] tracking-wide font-medium">SSRF-SAFE LEXICAL ANALYSIS</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            className="text-xs text-slate-300 border-white/[0.1] hover:border-red-500/40 hover:text-red-400 hover:bg-red-950/20"
          >
            <LogOut className="h-3.5 w-3.5 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Sign Out</span>
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
        <div className="space-y-4 pt-2 text-slate-200">
          {/* Engine Status Grid */}
          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/30 flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Engine Status</p>
                <p className="text-emerald-300 font-semibold text-xs mt-0.5">ACTIVE &bull; 100% ONLINE</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/30 flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">SSRF Prevention</p>
                <p className="text-cyan-300 font-semibold text-xs mt-0.5">ZERO OUTBOUND FETCH</p>
              </div>
            </div>
          </div>

          {/* Architecture Explanation */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-white/[0.08] space-y-2 text-xs leading-relaxed text-slate-300">
            <h4 className="font-semibold text-white font-mono flex items-center gap-2 text-xs">
              <Cpu className="h-4 w-4 text-cyan-400" />
              What is SSRF-Safe Lexical Analysis?
            </h4>
            <p>
              Traditional scanners often initiate blind HTTP/GET requests to target URLs, making servers vulnerable to 
              <span className="text-red-300 font-mono"> Server-Side Request Forgery (SSRF)</span>, internal network port scanning, and cloud metadata theft (such as <code className="text-cyan-300 font-mono">169.254.169.254</code>).
            </p>
            <p>
              Optimus eliminates this vulnerability by executing <span className="text-cyan-300 font-semibold">100% offline lexical analysis</span>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px] pl-1">
              <li><strong className="text-slate-200">Zero Target Connections:</strong> Evaluates target URLs in memory without pinging target IPs.</li>
              <li><strong className="text-slate-200">Shannon Entropy Analysis:</strong> Detects algorithmically generated domains (DGA) and credential theft slugs.</li>
              <li><strong className="text-slate-200">Brand Homoglyph Detection:</strong> Flags Unicode confusables (e.g., Cyrillic 'а' replacing Latin 'a').</li>
              <li><strong className="text-slate-200">Levenshtein Edit Distance:</strong> Automatically spots typosquats against your protected brand domains.</li>
              <li><strong className="text-slate-200">Private IP Guard:</strong> Classifies raw IP hosts (`10.x`, `192.168.x`, `127.x`) as high-risk anomalies without sending packets.</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSsrfModalOpen(false)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              variant="cyan"
              size="sm"
              onClick={() => {
                setIsSsrfModalOpen(false);
                router.push("/analyzer");
              }}
              className="text-xs shadow-liquid-cyan"
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
