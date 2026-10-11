"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Radio,
  FileCheck2,
  Lock,
  ArrowRight,
  Activity,
  Globe,
  Shield,
  Eye,
  CheckCircle2,
  Users,
  KeyRound,
  Check,
  Mail,
  Zap,
  Menu,
  X,
  Sparkles,
  Bot,
  AlertTriangle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Aurora Borealis Frosted Glass Card styling
  const getCardClasses = (accentBorder?: string) => {
    return `aurora-card backdrop-blur-2xl bg-[#0c1428]/75 border ${accentBorder || "border-white/[0.08]"} rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-emerald-500/35 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_32px_rgba(20,184,166,0.15),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-1 transition-all duration-300`;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200 relative overflow-x-hidden font-sans">
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

      {/* Northern Lights (Aurora Borealis) Ambient Atmospheric Curtains */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Aurora Ribbon 1: Luminous Mint & Emerald glow */}
        <div className="absolute -top-[15%] left-[8%] w-[750px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/22 via-teal-400/20 to-transparent blur-[140px] animate-aurora-1" />

        {/* Aurora Ribbon 2: Royal Indigo & Electric Violet glow */}
        <div className="absolute top-[28%] -right-[12%] w-[800px] h-[700px] rounded-full bg-gradient-to-bl from-indigo-500/25 via-purple-600/20 to-transparent blur-[150px] animate-aurora-2" />

        {/* Aurora Ribbon 3: Deep Arctic Cyan & Teal glow */}
        <div className="absolute -bottom-[10%] left-[20%] w-[850px] h-[650px] rounded-full bg-gradient-to-tr from-teal-500/20 via-cyan-500/16 to-transparent blur-[140px] animate-aurora-3" />

        {/* Subtle Cyber Starlight Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(3,7,18,0.5)_100%)]" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#030712]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0 group">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="OPTIMUS Cyber Defense"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_12px_rgba(20,184,166,0.5)]"
              />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold tracking-wider text-white flex items-center gap-1.5 sm:gap-2 font-unbounded">
                OPTIMUS{" "}
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/20 font-plex-mono font-semibold">
                  DRP
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-plex-mono tracking-tight hidden sm:block truncate">
                Cyber Defense Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 font-plex-mono text-xs text-slate-300">
            <a href="#about" className="hover:text-teal-300 transition-colors">
              About
            </a>
            <a href="#how-it-works" className="hover:text-teal-300 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-teal-300 transition-colors">
              Features
            </a>
            <a href="#benefits" className="hover:text-teal-300 transition-colors">
              Benefits
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-plex-mono px-3 sm:px-4 py-2"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="hidden xs:inline-block">
              <Button
                variant="primary"
                size="sm"
                className="text-xs font-plex-mono px-3 sm:px-4 py-2"
              >
                Get Started
              </Button>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#091428] border border-white/[0.08] text-teal-400 hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0e1628] border-b border-white/[0.08] px-5 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 font-plex-mono text-xs">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-sky-400 border-b border-white/5"
            >
              About OPTIMUS
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-sky-400 border-b border-white/5"
            >
              How It Works (3 Steps)
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-sky-400 border-b border-white/5"
            >
              6 Security Features
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-sky-400 border-b border-white/5"
            >
              Why Choose OPTIMUS
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full text-xs font-mono justify-center">
                  Sign In to Console
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full text-xs font-mono justify-center">
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-plex-mono backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold tracking-wide text-[11px] sm:text-xs">
                AURORA CYBER DEFENSE &bull; REAL-TIME INTELLIGENCE
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.15] font-unbounded">
              Protect Your Website, Brand &amp; Links from{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-300 drop-shadow-[0_2px_24px_rgba(16,185,129,0.35)]">
                Cyber Threats
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-plex-sans max-w-2xl">
              Cybercriminals create fake websites, send phishing links, and copy your brand to scam people. OPTIMUS continuously scans the internet, detects dangerous links in seconds, and gets fake sites taken down before they cause harm.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Link href="/analyzer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto text-xs font-semibold px-6 sm:px-8 py-3.5 font-plex-mono"
                >
                  Scan a Link Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-semibold px-6 sm:px-7 py-3.5 font-plex-mono"
                >
                  See How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Right: Live Threat Telemetry Console Panel */}
          <div className="lg:col-span-5 w-full">
            <div className={`rounded-3xl p-5 sm:p-7 relative overflow-hidden ${getCardClasses("border-emerald-500/30 hover:border-emerald-400/50 shadow-[0_20px_50px_rgba(3,7,18,0.85),0_0_40px_rgba(16,185,129,0.1)]")}`}>
              {/* Scan Beam Effect with Aurora colors */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-500 opacity-90 shadow-[0_0_12px_rgba(20,184,166,0.6)]" />

              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#071318] border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-[0_0_12px_rgba(20,184,166,0.2)]">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-unbounded">LIVE LINK SAFETY SCANNER</h3>
                    <p className="text-[10px] font-plex-mono text-teal-400">INSTANT CHECKS &bull; ZERO RISK</p>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>

              {/* Risk Gauge Header */}
              <div className="my-4 sm:my-5 p-3.5 sm:p-4 rounded-2xl bg-[#06101c]/80 border border-white/[0.08] flex items-center gap-3.5 sm:gap-4 relative overflow-hidden backdrop-blur-xl">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="url(#risk-grad-aurora)"
                      strokeWidth="5"
                      strokeDasharray="163"
                      strokeDashoffset="20"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="risk-grad-aurora" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="40%" stopColor="#14b8a6" />
                        <stop offset="70%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-sm font-extrabold font-plex-mono text-white">88</span>
                </div>
                <div>
                  <span className="text-[10px] font-plex-mono text-rose-400 font-bold uppercase tracking-wider">
                    HIGH RISK DETECTED
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">Fake Website Impersonating Brand</p>
                  <p className="text-[10px] text-slate-400 font-plex-mono">Contains deceptive letters &bull; Steals passwords</p>
                </div>
              </div>

              {/* 4 Live Telemetry Findings */}
              <div className="space-y-2 sm:space-y-2.5 font-plex-mono">
                {/* 1. Critical */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#091424]/75 border border-rose-500/25 flex items-center justify-between gap-2.5 text-xs backdrop-blur-md">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                      paypaI-security-login.com
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">
                      Fake login site trying to steal credentials
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/25 font-bold shrink-0">
                    Danger
                  </span>
                </div>

                {/* 2. Review */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#091424]/75 border border-amber-500/25 flex items-center justify-between gap-2.5 text-xs backdrop-blur-md">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                      optimus-support-fake.net
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">
                      Copycat name created 2 days ago
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 font-bold shrink-0">
                    Warning
                  </span>
                </div>

                {/* 3. Matched */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#091424]/75 border border-purple-500/25 flex items-center justify-between gap-2.5 text-xs backdrop-blur-md">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                      pastebin.com/raw/leak
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">
                      Company emails found in public leak
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 font-bold shrink-0">
                    Alert
                  </span>
                </div>

                {/* 4. Clear */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#091424]/75 border border-emerald-500/25 flex items-center justify-between gap-2.5 text-xs backdrop-blur-md">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                      optimus-drp.io
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">
                      Official verified company website
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-bold shrink-0">
                    Safe
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Row (Clean, Mobile-Compact, Aurora Palette) */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className={`rounded-3xl p-5 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 ${getCardClasses("border-emerald-500/25 shadow-[0_16px_40px_rgba(3,7,18,0.7),0_0_30px_rgba(16,185,129,0.06)]")}`}>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-emerald-400 font-unbounded drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">100+</p>
            <p className="text-[11px] sm:text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">
              Attacks Stopped
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-teal-300 font-unbounded drop-shadow-[0_0_12px_rgba(20,184,166,0.3)]">24/7</p>
            <p className="text-[11px] sm:text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">
              Active Monitoring
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-cyan-400 font-unbounded drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]">&lt; 10s</p>
            <p className="text-[11px] sm:text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">
              Instant Scan Time
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-indigo-400 font-unbounded drop-shadow-[0_0_12px_rgba(99,102,241,0.3)]">0 - 100</p>
            <p className="text-[11px] sm:text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">
              Simple Risk Score
            </p>
          </div>
        </div>
      </section>

      {/* About Section (Simple Explanations, Aurora Glow) */}
      <section id="about" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-plex-mono text-emerald-400 uppercase tracking-widest block mb-2 font-semibold">
            About OPTIMUS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-unbounded">
            Why You Need Protection Outside Firewalls
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-plex-sans">
            Traditional antivirus protects your laptop. OPTIMUS protects your brand, website, and customers on the public internet.
          </p>
        </div>

        <div className={`rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center ${getCardClasses("border-teal-500/25")}`}>
          <div className="space-y-5">
            <h3 className="text-lg sm:text-2xl font-bold text-white font-unbounded">
              Stopping Scams Before They Reach Your Users
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              Most phishing attacks and online fraud don't hack your server directly. Instead, scammers buy similar domain names, copy your website logo, and send fake links to your customers.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              <strong className="text-emerald-300 font-semibold">OPTIMUS Digital Risk Protection</strong> watches the entire internet 24/7. When someone registers a fake copy of your website or leaks your credentials, you get an instant alert and a ready-to-use takedown report.
            </p>
            <div className="space-y-2.5 pt-2 font-plex-sans text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">Catches fake domains days before scammers start sending emails.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">Zero installation required—works instantly right inside your browser.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">Generates official legal takedown notices with one click.</span>
              </div>
            </div>
          </div>

          {/* Simple Visual Diagram with Aurora accents */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#06101c]/90 border border-white/[0.08] space-y-3.5 backdrop-blur-xl">
            <div className="text-[10px] sm:text-[11px] font-plex-mono text-slate-400 uppercase tracking-widest text-center">
              The Threat Lifecycle
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-plex-mono text-[10px] sm:text-xs">
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/35 text-red-400">
                Fake Websites
              </div>
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/35 text-red-400">
                Phishing Links
              </div>
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/35 text-red-400">
                Leaked Data
              </div>
            </div>
            <div className="text-center text-xs font-plex-mono text-teal-300 py-1 font-semibold flex items-center justify-center gap-2">
              <span>&darr;</span> Blocked &amp; Reported by OPTIMUS <span>&darr;</span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl border border-dashed border-emerald-500/40 bg-[#081b22]/70 text-center shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
              <div className="text-xs font-plex-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
                Your Protected Organization
              </div>
              <div className="text-[10px] sm:text-[11px] font-plex-mono text-slate-300">
                Customers, Company Reputation, &amp; Sensitive Accounts Remain Safe
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Easy Steps, Aurora Aurora gradient stages) */}
      <section id="how-it-works" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-plex-mono text-emerald-400 uppercase tracking-widest block mb-2 font-semibold">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-unbounded">
            How OPTIMUS Protects You
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-plex-sans">
            Protecting your brand takes seconds. Here is how our automated system keeps you secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Step 1 - Emerald */}
          <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${getCardClasses("border-emerald-500/30 hover:border-emerald-400/50 shadow-[0_12px_36px_rgba(3,7,18,0.7),0_0_20px_rgba(16,185,129,0.08)]")}`}>
            <div>
              <div className="h-11 w-11 rounded-2xl bg-[#06181b] border border-emerald-500/35 text-emerald-400 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-plex-mono text-emerald-400 uppercase tracking-wider font-bold">STEP 01</span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-unbounded mt-1 mb-2.5">
                Paste or Monitor Links
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
                Paste any link, email, or domain into OPTIMUS. We also automatically scan newly registered domains across the web 24/7.
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.06] text-[11px] font-plex-mono text-emerald-400">
              &bull; Instant link checks &bull; Domain watchlist
            </div>
          </div>

          {/* Step 2 - Arctic Teal */}
          <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${getCardClasses("border-teal-500/30 hover:border-teal-400/50 shadow-[0_12px_36px_rgba(3,7,18,0.7),0_0_20px_rgba(20,184,166,0.08)]")}`}>
            <div>
              <div className="h-11 w-11 rounded-2xl bg-[#071922] border border-teal-500/35 text-teal-400 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-plex-mono text-teal-300 uppercase tracking-wider font-bold">STEP 02</span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-unbounded mt-1 mb-2.5">
                Instant Risk Analysis
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
                Get a clear safety score from 0 (safe) to 100 (dangerous). We check for lookalike letters, hidden redirects, and WHOIS details in seconds.
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.06] text-[11px] font-plex-mono text-teal-300">
              &bull; Clear 0-100 score &bull; Plain-English explanation
            </div>
          </div>

          {/* Step 3 - Aurora Indigo */}
          <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${getCardClasses("border-indigo-500/30 hover:border-indigo-400/50 shadow-[0_12px_36px_rgba(3,7,18,0.7),0_0_20px_rgba(99,102,241,0.08)]")}`}>
            <div>
              <div className="h-11 w-11 rounded-2xl bg-[#0e1329] border border-indigo-500/35 text-indigo-400 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-plex-mono text-indigo-300 uppercase tracking-wider font-bold">STEP 03</span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-unbounded mt-1 mb-2.5">
                Fast Takedown &amp; Removal
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
                When a threat is confirmed, OPTIMUS prepares legal abuse notices so domain registrars and web hosts take down the malicious site.
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.06] text-[11px] font-plex-mono text-indigo-300">
              &bull; One-click report &bull; Threat neutralised
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Features (Intuitive, Simple Names, Aurora Palettes) */}
      <section id="features" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-plex-mono text-emerald-400 uppercase tracking-widest block mb-2 font-semibold">
            All-In-One Protection
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-unbounded">
            Everything You Need to Stay Safe
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-plex-sans">
            Six powerful features designed to protect your team, customers, and online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* 1. Fake Website Scanner */}
          <div className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between ${getCardClasses("border-emerald-500/30 hover:border-emerald-400/50")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#06181b] border border-emerald-500/35 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/25">
                  Link Scanner
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2">
                Fake Website &amp; Link Scanner
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Paste any web address to immediately test for phishing, lookalike spellings, and harmful redirects.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Spots typosquatting &amp; lookalike URLs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Explains why a link is risky in seconds</span>
              </div>
            </div>
          </div>

          {/* 2. Brand & Logo Defense */}
          <div className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between ${getCardClasses("border-teal-500/30 hover:border-teal-400/50")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#071922] border border-teal-500/35 text-teal-400 flex items-center justify-center shadow-[0_0_12px_rgba(20,184,166,0.2)]">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-bold border border-teal-500/25">
                  Brand Defense
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2">
                Brand &amp; Logo Defense
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Prevents cybercriminals from copying your company logo, trade name, or customer support pages.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>Monitors unauthorized logo copying</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>Catches fake customer service sites</span>
              </div>
            </div>
          </div>

          {/* 3. Phishing Email Inspector */}
          <div className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between ${getCardClasses("border-indigo-500/30 hover:border-indigo-400/50")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#0e1329] border border-indigo-500/35 text-indigo-400 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/25">
                  Email Inspector
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2">
                Phishing Email Inspector
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Paste suspicious email headers to check SPF, DKIM, and DMARC verification and uncover forged senders.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Reveals the real sender email &amp; IP</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Verifies sender authentication flags</span>
              </div>
            </div>
          </div>

          {/* 4. Domain & WHOIS Explorer */}
          <div className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between ${getCardClasses("border-cyan-500/30 hover:border-cyan-400/50")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#071824] border border-cyan-500/35 text-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <Eye className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/25">
                  Domain Intel
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2">
                Domain &amp; WHOIS History
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                See when a website was created, who registered it, which registrar was used, and where the server is located.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Domain age and creation timestamp</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>DNS mail records and name servers</span>
              </div>
            </div>
          </div>

          {/* 5. Stolen Password & Dark Web Watch */}
          <div className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between ${getCardClasses("border-rose-500/30 hover:border-rose-400/50")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#1d0e16] border border-rose-500/35 text-rose-400 flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.2)]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-bold border border-rose-500/25">
                  Leak Alert
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2">
                Stolen Password &amp; Leak Watch
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Monitors data breaches and leak sites. Notifies you immediately if company emails or passwords leak online.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span>Immediate breach notification alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span>Guides users to reset compromised keys</span>
              </div>
            </div>
          </div>

          {/* 6. BILY AI Assistant */}
          <div className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between ${getCardClasses("border-emerald-500/30 hover:border-emerald-400/50")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#06181b] border border-emerald-500/35 text-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/25">
                  AI Assistant
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2">
                BILY Cyber Assistant
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-plex-sans">
                Ask our cyber assistant any question. BILY explains complex technical risks in simple, easy-to-understand advice.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] space-y-1 font-plex-mono text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Explains dangerous links clearly</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Step-by-step investigation help</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Value / Benefits */}
      <section id="benefits" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-plex-mono text-emerald-400 uppercase tracking-widest block mb-2 font-semibold">
            Real-World Impact
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-unbounded">
            Why Organizations Choose OPTIMUS
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-plex-sans">
            Built to keep security simple, fast, and accessible for any team or business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className={`rounded-3xl p-6 sm:p-8 ${getCardClasses("border-emerald-500/30 hover:border-emerald-400/50")}`}>
            <div className="h-11 w-11 rounded-2xl bg-[#06181b] border border-emerald-500/35 text-emerald-400 flex items-center justify-center mb-5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2.5">
              Catch Scams Early
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              Find lookalike websites and fraudulent links before any employee or customer has a chance to click on them.
            </p>
          </div>

          <div className={`rounded-3xl p-6 sm:p-8 ${getCardClasses("border-teal-500/30 hover:border-teal-400/50")}`}>
            <div className="h-11 w-11 rounded-2xl bg-[#071922] border border-teal-500/35 text-teal-300 flex items-center justify-center mb-5 shadow-[0_0_12px_rgba(20,184,166,0.2)]">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2.5">
              Save Time &amp; Investigation Costs
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              Automated scoring replaces hours of manual WHOIS, DNS, and header checks with an instant 0-to-100 verdict.
            </p>
          </div>

          <div className={`rounded-3xl p-6 sm:p-8 ${getCardClasses("border-indigo-500/30 hover:border-indigo-400/50")}`}>
            <div className="h-11 w-11 rounded-2xl bg-[#0e1329] border border-indigo-500/35 text-indigo-400 flex items-center justify-center mb-5 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2.5">
              Protect Customer Trust
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              Keep your reputation safe. When customers know your brand is protected against copycats, their trust remains strong.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className={`rounded-3xl p-7 sm:p-12 lg:p-16 text-center relative overflow-hidden bg-gradient-to-r from-[#041419] via-[#08182b] to-[#0c102a] border border-emerald-500/30 shadow-[0_24px_60px_rgba(2,6,23,0.9),inset_0_1px_0_rgba(255,255,255,0.12),0_0_50px_rgba(16,185,129,0.1)]`}>
          <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-unbounded tracking-tight">
              See your exposure before attackers do
            </h2>
            <p className="text-xs sm:text-base text-slate-300 font-plex-sans leading-relaxed">
              Check suspicious links, inspect domains, and protect your brand identity with real-time cybersecurity intelligence.
            </p>
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/analyzer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto text-xs font-semibold px-6 sm:px-8 py-3.5 font-plex-mono"
                >
                  Scan a Link Now Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-semibold px-6 sm:px-7 py-3.5 font-plex-mono"
                >
                  Sign In to Console
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Mobile Friendly, Aurora Accents) */}
      <footer className="border-t border-white/[0.08] bg-[#02050c] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative font-plex-mono text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="OPTIMUS"
            className="h-6 w-6 object-contain filter drop-shadow-[0_2px_8px_rgba(16,185,129,0.45)]"
          />
          <div>
            <span className="font-unbounded font-bold text-white">OPTIMUS</span> &bull; Cyber Defense Platform &copy; 2026.
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link href="/login" className="hover:text-teal-300 transition-colors">
            Login
          </Link>
          <Link href="/analyzer" className="hover:text-teal-300 transition-colors">
            Link Scanner
          </Link>
          <Link href="/register" className="hover:text-teal-300 transition-colors">
            Register
          </Link>
        </div>
      </footer>
    </div>
  );
}
