"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Radio,
  FileCheck2,
  Lock,
  ArrowRight,
  Activity,
  Fingerprint,
  Zap,
  Cpu,
  Globe,
  Layers,
  Sparkles,
  Shield,
  Eye,
  CheckCircle2,
  Users,
  MapPin,
  KeyRound,
  Sliders,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  // Pure claymorphism card styling with tactile inner highlights and deep outer drop shadows
  const getCardClasses = (accentBorder?: string) => {
    return `bg-[#0d1a38] border ${accentBorder || "border-white/[0.08]"} shadow-[14px_18px_36px_rgba(2,6,18,0.85),-6px_-6px_20px_rgba(18,32,68,0.25),inset_4px_4px_8px_rgba(255,255,255,0.08),inset_-6px_-6px_14px_rgba(0,0,0,0.55)] hover:shadow-[18px_24px_46px_rgba(2,6,18,0.95),-8px_-8px_24px_rgba(22,40,85,0.35),inset_5px_5px_10px_rgba(255,255,255,0.12),inset_-7px_-7px_16px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-300`;
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Google Fonts Preconnect & Stylesheet */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Unbounded:wght@400;600;700;800;900&display=swap');
        
        .font-unbounded {
          font-family: 'Unbounded', sans-serif;
        }
        .font-plex-sans {
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .font-plex-mono {
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>

      {/* Holographic Matrix Grid & Neon Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
        <div className="cyber-glow-orb -top-32 -left-32 w-[600px] h-[600px] bg-cyan-500/22" />
        <div className="cyber-glow-orb top-1/3 -right-40 w-[650px] h-[650px] bg-purple-600/20" />
        <div className="cyber-glow-orb -bottom-40 left-1/4 w-[600px] h-[600px] bg-pink-600/18" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#060b18]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 min-w-0 group">
            <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-[#091530] border border-cyan-400/50 shadow-[0_0_18px_rgba(0,240,255,0.35),inset_1.5px_1.5px_3px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="OPTIMUS Cyber Defense"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-base font-extrabold tracking-wider text-white flex items-center gap-2 font-unbounded">
                OPTIMUS{" "}
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-plex-mono font-semibold">
                  DRP
                </span>
              </span>
              <p className="text-[10px] text-cyan-300/70 font-plex-mono tracking-tight hidden sm:block truncate">
                CyberDefend Platform
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 font-plex-mono text-xs text-slate-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">
              About
            </a>
            <a href="#capabilities" className="hover:text-cyan-400 transition-colors">
              Platform Architecture
            </a>
            <a href="#use-cases" className="hover:text-cyan-400 transition-colors">
              Use Cases
            </a>
            <a href="#value-pillars" className="hover:text-cyan-400 transition-colors">
              Value Pillars
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs font-plex-mono border-white/10 bg-[#0d1a38] text-slate-200 hover:text-white hover:bg-[#12234b] shadow-[4px_6px_16px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.15)]">
                Console Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="cyan" size="sm" className="text-xs font-plex-mono shadow-[6px_8px_20px_rgba(0,240,255,0.25),inset_2px_2px_4px_rgba(255,255,255,0.3)]">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative pt-16 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/35 bg-cyan-950/40 text-cyan-300 text-xs font-plex-mono backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold tracking-wide">
                AUTONOMOUS PERIMETER INTELLIGENCE &bull; ACTIVE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] font-unbounded">
              Protect every domain, link and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 drop-shadow-[0_0_35px_rgba(6,182,212,0.45)]">
                brand you own
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-plex-sans max-w-2xl">
              Modern adversaries operate beyond your firewall—registering counterfeit domains, staging credential harvests, and cloning brand assets across the public web. Optimus neutralizes hostile attacker infrastructure before threats reach your perimeter.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="cyan" className="w-full sm:w-auto text-xs font-semibold px-8 font-plex-mono shadow-liquid-cyan">
                  Start a free assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href="#capabilities" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xs font-semibold px-7 font-plex-mono border-slate-700 bg-slate-900/60 hover:bg-slate-800">
                  Platform Architecture
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Right: Live Threat Telemetry Console Panel */}
          <div className="lg:col-span-5">
            <div className={`rounded-3xl p-6 sm:p-7 relative overflow-hidden ${getCardClasses("border-cyan-500/40")}`}>
              {/* Scan Beam Effect */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 opacity-80" />

              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-unbounded">HEURISTIC TELEMETRY CONSOLE</h3>
                    <p className="text-[10px] font-plex-mono text-cyan-400">SSRF-SAFE LEXICAL ANALYSIS &bull; 0 OUTBOUND CALLS</p>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Risk Gauge Header */}
              <div className="my-5 p-4 rounded-2xl bg-[#070e1e]/80 border border-white/[0.08] flex items-center gap-4 relative overflow-hidden">
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="url(#risk-grad)"
                      strokeWidth="5"
                      strokeDasharray="163"
                      strokeDashoffset="20"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="risk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f0ff" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-sm font-extrabold font-plex-mono text-white">88</span>
                </div>
                <div>
                  <span className="text-[10px] font-plex-mono text-red-400 font-bold uppercase tracking-wider">
                    CRITICAL RISK LEVEL
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">Brand Impersonation Cluster Spotted</p>
                  <p className="text-[10px] text-slate-400 font-plex-mono">Shannon entropy &gt; 3.84 &bull; Homoglyph confusable</p>
                </div>
              </div>

              {/* 4 Live Telemetry Findings */}
              <div className="space-y-2.5 font-plex-mono">
                {/* 1. Critical */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-red-500/25 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate">paypaI-secures-verify.com</div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">Cyrillic 'а' substitution &bull; Credential harvest</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-500/40 font-bold flex-shrink-0">
                    Critical
                  </span>
                </div>

                {/* 2. Review */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/25 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate">app-optimus-drp-auth.net</div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">Levenshtein distance 1 &bull; MX record weaponized</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-400 border border-amber-500/40 font-bold flex-shrink-0">
                    Review
                  </span>
                </div>

                {/* 3. Matched */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/25 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate">pastebin.com/raw/k9X2bF</div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">Domain signature matched in public leak dump</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-400 border border-purple-500/40 font-bold flex-shrink-0">
                    Matched
                  </span>
                </div>

                {/* 4. Clear */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate">cdn.cyberdefend-assets.global</div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">Authoritative TLS verified &bull; Sanitized asset</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold flex-shrink-0">
                    Clear
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Row */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className={`rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800 ${getCardClasses()}`}>
          <div className="text-center px-4">
            <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-unbounded">13</p>
            <p className="text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">Assets Monitored</p>
          </div>
          <div className="text-center px-4 pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-unbounded">24/7</p>
            <p className="text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">Continuous Scoring</p>
          </div>
          <div className="text-center px-4 pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-unbounded">&lt; 5 min</p>
            <p className="text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">Median Triage Time</p>
          </div>
          <div className="text-center px-4 pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-pink-400 font-unbounded">100%</p>
            <p className="text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">SSRF-Safe Lexical (0 Fetches)</p>
          </div>
        </div>
      </section>

      {/* What is Digital Risk Protection (DRP) Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-plex-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
            Threat Horizon &bull; About DRP
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-unbounded">
            What is Digital Risk Protection (DRP)?
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-plex-sans">
            Defending what firewalls and endpoints cannot see: threats born outside your network on the public web.
          </p>
        </div>

        <div className={`rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${getCardClasses()}`}>
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-unbounded">
              Beyond The Security Perimeter
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-plex-sans">
              Traditional cybersecurity guards endpoints, email inboxes, and internal cloud infrastructure. However, over 80% of modern phishing campaigns, lookalike websites, and brand fraud originate on public web platforms completely outside your perimeter.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed font-plex-sans">
              <strong className="text-cyan-400 font-semibold">Digital Risk Protection (DRP)</strong> continuously scans the public, deep, and dark web to detect typosquatted domains, social media impersonations, leaked employee credentials, and hostile brand exploits the moment they are staged—long before malicious payloads reach your internal network.
            </p>
            <div className="space-y-3 pt-2 font-plex-sans text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-200">Identifies attacker preparations weeks prior to active phishing execution.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-200">Zero endpoint agent installations or complex firewall integrations required.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-200">Automated legal-grade takedown requests sent directly to registrars and hosts.</span>
              </div>
            </div>
          </div>

          {/* Interactive Perimeter Diagram Visual */}
          <div className="p-6 rounded-2xl bg-[#070e20] border border-cyan-500/20 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.65),inset_-2px_-2px_6px_rgba(255,255,255,0.05)] space-y-4">
            <div className="text-[11px] font-plex-mono text-slate-400 uppercase tracking-widest text-center">
              External Wild Web (Threat Vector Stage)
            </div>
            <div className="grid grid-cols-3 gap-2.5 text-center font-plex-mono text-[11px]">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/35 text-red-400 shadow-[3px_4px_10px_rgba(2,6,18,0.6),inset_1px_1px_2px_rgba(255,255,255,0.06),inset_-2px_-2px_4px_rgba(0,0,0,0.5)]">
                Lookalike Domains
              </div>
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/35 text-red-400 shadow-[3px_4px_10px_rgba(2,6,18,0.6),inset_1px_1px_2px_rgba(255,255,255,0.06),inset_-2px_-2px_4px_rgba(0,0,0,0.5)]">
                Dark Web Dumps
              </div>
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/35 text-red-400 shadow-[3px_4px_10px_rgba(2,6,18,0.6),inset_1px_1px_2px_rgba(255,255,255,0.06),inset_-2px_-2px_4px_rgba(0,0,0,0.5)]">
                Fake Profiles
              </div>
            </div>
            <div className="text-center text-xs font-plex-mono text-cyan-400 py-1 font-semibold flex items-center justify-center gap-2">
              <span>&darr;</span> Blocked by Optimus DRP <span>&darr;</span>
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-white/20 bg-[#0a142c] text-center shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5)]">
              <div className="text-xs font-plex-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
                Traditional Corporate Perimeter
              </div>
              <div className="text-[11px] font-plex-mono text-slate-400">
                Firewalls &bull; EDR Agents &bull; Secure Email Gateways
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tri-Phasic Architecture Pillars (Clean & Direct) */}
      <section id="capabilities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-plex-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
            Operational Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-unbounded">
            Tri-Phasic Threat Defense Pipeline
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-plex-sans">
            Engineered from first principles to discover adversary staging, evaluate threat telemetry, and dismantle hostile infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Component 1: Visibility */}
          <div className={`rounded-3xl p-8 flex flex-col justify-between ${getCardClasses("border-cyan-500/30")}`}>
            <div>
              <div className="h-12 w-12 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-plex-mono text-cyan-400 uppercase tracking-wider font-bold">PHASE 01 // DISCOVERY</span>
              <h3 className="text-xl font-bold text-white font-unbounded mt-1 mb-3">Continuous Visibility</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-plex-sans">
                Real-time ingestion across Newly Registered Domain (NRD) zone files, paste networks, dark web repositories, and social platforms before attacks strike.
              </p>
            </div>
            <div className="pt-6 flex flex-wrap gap-1.5 font-plex-mono text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">NRD Feeds</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">Dark Web Forums</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">Code Repositories</span>
            </div>
          </div>

          {/* Component 2: Analysis */}
          <div className={`rounded-3xl p-8 flex flex-col justify-between ${getCardClasses("border-purple-500/30")}`}>
            <div>
              <div className="h-12 w-12 rounded-2xl bg-purple-950/70 border border-purple-500/40 text-purple-300 flex items-center justify-center mb-6">
                <Cpu className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-plex-mono text-purple-400 uppercase tracking-wider font-bold">PHASE 02 // INTELLIGENCE</span>
              <h3 className="text-xl font-bold text-white font-unbounded mt-1 mb-3">Explainable Analysis</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-plex-sans">
                In-memory lexical inspection computing Shannon entropy, Cyrillic confusables, and Levenshtein distance with 0 outbound HTTP fetches to preserve server isolation.
              </p>
            </div>
            <div className="pt-6 flex flex-wrap gap-1.5 font-plex-mono text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">Shannon Entropy</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">Zero Outbound SSRF</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">Deterministic 0-100</span>
            </div>
          </div>

          {/* Component 3: Disruption */}
          <div className={`rounded-3xl p-8 flex flex-col justify-between ${getCardClasses("border-red-500/30")}`}>
            <div>
              <div className="h-12 w-12 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-300 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-plex-mono text-red-400 uppercase tracking-wider font-bold">PHASE 03 // DISMANTLE</span>
              <h3 className="text-xl font-bold text-white font-unbounded mt-1 mb-3">Automated Disruption</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-plex-sans">
                Decisive takedowns of hostile infrastructure. Compiles cryptographic evidence dossiers, formats legal abuse notices, and coordinates directly with global registrars and hosts.
              </p>
            </div>
            <div className="pt-6 flex flex-wrap gap-1.5 font-plex-mono text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/30">Host Escalation</span>
              <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/30">Evidence Dossiers</span>
              <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/30">Fast Takedowns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Six Targeted Use Cases (Each with Its Distinct Accent Color) */}
      <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-plex-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
            Threat Horizons
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-unbounded">
            Six Dedicated Defense Modules
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-plex-sans">
            Specialized protection packages safeguarding brand identities, executive personnel, and proprietary digital assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Domain Monitoring (Cyan) */}
          <div className={`rounded-3xl p-7 border-t-4 border-t-cyan-400 flex flex-col justify-between ${getCardClasses("border-cyan-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
                  Domain Guard
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-unbounded mb-2">Domain Monitoring &amp; Protection</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Instantly surfaces lookalike combosquats, typosquats, and malicious redirect links impersonating your primary enterprise domains.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400" />
                <span>Combosquat &amp; typosquatting radar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400" />
                <span>Active MX record weaponisation alerts</span>
              </div>
            </div>
          </div>

          {/* 2. Brand Impersonation (Violet) */}
          <div className={`rounded-3xl p-7 border-t-4 border-t-purple-400 flex flex-col justify-between ${getCardClasses("border-purple-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-500/30">
                  Brand Shield
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-unbounded mb-2">Brand Impersonation &amp; Fraud</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Stops visual identity theft. Tracks unauthorized logo usage, fraudulent seasonal discount sites, and fake customer support portals.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-purple-400" />
                <span>Homoglyph brand confusable detection</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-purple-400" />
                <span>Fake customer service hotline sweeps</span>
              </div>
            </div>
          </div>

          {/* 3. Social Media Threats (Pink) */}
          <div className={`rounded-3xl p-7 border-t-4 border-t-pink-500 flex flex-col justify-between ${getCardClasses("border-pink-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-pink-950/80 border border-pink-500/30 text-pink-400 flex items-center justify-center">
                  <Eye className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 font-bold border border-pink-500/30">
                  Social Guard
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-unbounded mb-2">Social Media Threats &amp; Scams</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Continuous discovery of fraudulent accounts, fake community giveaways, and scam bots preying on your online brand followers.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-pink-400" />
                <span>Cross-platform profile spoofing radar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-pink-400" />
                <span>Phishing link distribution interception</span>
              </div>
            </div>
          </div>

          {/* 4. Executive VIP Protection (Amber) */}
          <div className={`rounded-3xl p-7 border-t-4 border-t-amber-400 flex flex-col justify-between ${getCardClasses("border-amber-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                  VIP Guard
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-unbounded mb-2">Executive &amp; VIP Protection</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Safeguards leadership from targeted spear-phishing, spoofed executive identities, deepfake campaigns, and leaked personal credentials.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-amber-400" />
                <span>Executive account cloning defense</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-amber-400" />
                <span>Doxxing &amp; personal data breach watch</span>
              </div>
            </div>
          </div>

          {/* 5. Location & Physical Intelligence (Orange) */}
          <div className={`rounded-3xl p-7 border-t-4 border-t-orange-400 flex flex-col justify-between ${getCardClasses("border-orange-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-950/80 border border-orange-500/30 text-orange-400 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 font-bold border border-orange-500/30">
                  Physical Threat
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-unbounded mb-2">Location &amp; Facility Intel</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Correlates open-source intelligence, geopolitical protests, and public-safety anomalies occurring within proximity of company offices.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-orange-400" />
                <span>Geofenced public-safety event alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-orange-400" />
                <span>Facility security team escalation feeds</span>
              </div>
            </div>
          </div>

          {/* 6. Dark Web & Credentials (Red) */}
          <div className={`rounded-3xl p-7 border-t-4 border-t-red-500 flex flex-col justify-between ${getCardClasses("border-red-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-red-950/80 border border-red-500/30 text-red-400 flex items-center justify-center">
                  <KeyRound className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-500/30">
                  Dark Web Watch
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-unbounded mb-2">Dark Web &amp; Leaked Credentials</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Deep surveillance into illicit cybercrime forums, illicit Telegram channels, and stealer-log caches for corporate logins on sale.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-red-400" />
                <span>Compromised employee password detection</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-red-400" />
                <span>Corporate database dump alerts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Value Pillars (Direct & Authoritative) */}
      <section id="value-pillars" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-plex-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
            Strategic Value
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-unbounded">
            Enterprise Risk Mitigation
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-plex-sans">
            Proactive risk reduction protecting balance sheets, intellectual property, and consumer trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`rounded-3xl p-8 ${getCardClasses("border-cyan-500/30")}`}>
            <div className="h-12 w-12 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mb-6">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-unbounded mb-3">Visibility Beyond the Perimeter</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-plex-sans">
              You cannot defend what you cannot see. While EDR protects internal endpoints, Optimus casts a global net across international TLDs and dark web forums to detect adversaries preparing attacks against your organization.
            </p>
          </div>

          <div className={`rounded-3xl p-8 ${getCardClasses("border-amber-500/30")}`}>
            <div className="h-12 w-12 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-unbounded mb-3">Preventing Costly Incidents</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-plex-sans">
              Remediating ransomware attacks or BEC wire fraud costs millions in incident response and regulatory penalties. Taking down malicious domains before weaponisation prevents initial entry entirely.
            </p>
          </div>

          <div className={`rounded-3xl p-8 ${getCardClasses("border-pink-500/30")}`}>
            <div className="h-12 w-12 rounded-2xl bg-pink-950/70 border border-pink-500/40 text-pink-300 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-unbounded mb-3">Preserving Brand Trust</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-plex-sans">
              Your brand is your organization's most valuable asset. When customers are deceived by lookalike sites impersonating your portal, brand reputation suffers immediately. Optimus safeguards brand trust everywhere online.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className={`rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden bg-[#0d1a38] border border-cyan-500/40 shadow-[14px_18px_40px_rgba(2,6,18,0.9),inset_-6px_-6px_14px_rgba(0,0,0,0.6),inset_6px_6px_14px_rgba(255,255,255,0.08)]`}>
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-unbounded tracking-tight">
              See your exposure before attackers do
            </h2>
            <p className="text-base text-slate-300 font-plex-sans leading-relaxed">
              Request an automated risk discovery assessment. Map lookalike domains, leaked employee credentials, and brand impersonations threatening your organization right now.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="cyan" className="w-full sm:w-auto text-xs font-semibold px-8 font-plex-mono shadow-[6px_8px_20px_rgba(0,240,255,0.3),inset_2px_2px_4px_rgba(255,255,255,0.35)]">
                  Request an assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-xs font-semibold px-7 font-plex-mono border-white/10 bg-[#070e20] hover:bg-[#0c1630] text-slate-200 hover:text-white shadow-[4px_6px_16px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.1)]">
                  Explore capabilities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#040812] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative font-plex-mono text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-unbounded font-bold text-white">OPTIMUS</span> &bull; CyberDefend Global Defense Platform &copy; 2026.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-cyan-400 transition-colors">SOC Portal</Link>
          <Link href="/analyzer" className="hover:text-cyan-400 transition-colors">Analyzer</Link>
          <Link href="/register" className="hover:text-cyan-400 transition-colors">Register</Link>
        </div>
      </footer>
    </div>
  );
}
