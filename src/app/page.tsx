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
        <div className="cyber-glow-orb -top-32 -left-32 w-[600px] h-[600px] bg-cyan-500/20" />
        <div className="cyber-glow-orb top-1/3 -right-40 w-[650px] h-[650px] bg-purple-600/18" />
        <div className="cyber-glow-orb -bottom-40 left-1/4 w-[600px] h-[600px] bg-pink-600/15" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#060b18]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0 group">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="OPTIMUS Cyber Defense"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_10px_rgba(0,240,255,0.4)]"
              />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold tracking-wider text-white flex items-center gap-1.5 sm:gap-2 font-unbounded">
                OPTIMUS{" "}
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-plex-mono font-semibold">
                  DRP
                </span>
              </span>
              <p className="text-[10px] text-cyan-300/70 font-plex-mono tracking-tight hidden sm:block truncate">
                Cyber Defense Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 font-plex-mono text-xs text-slate-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">
              About
            </a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              Features
            </a>
            <a href="#benefits" className="hover:text-cyan-400 transition-colors">
              Benefits
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-plex-mono border-white/10 bg-[#0d1a38] text-slate-200 hover:text-white hover:bg-[#12234b] px-3 sm:px-4 py-2"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="hidden xs:inline-block">
              <Button
                variant="cyan"
                size="sm"
                className="text-xs font-plex-mono shadow-liquid-cyan px-3 sm:px-4 py-2"
              >
                Get Started
              </Button>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0d1a38] border border-white/10 text-cyan-400 hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a1329] border-b border-cyan-500/30 px-5 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 font-plex-mono text-xs">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-cyan-400 border-b border-white/5"
            >
              About OPTIMUS
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-cyan-400 border-b border-white/5"
            >
              How It Works (3 Steps)
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-cyan-400 border-b border-white/5"
            >
              6 Security Features
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-cyan-400 border-b border-white/5"
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
                <Button variant="cyan" className="w-full text-xs font-mono justify-center">
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Section (Clear, Friendly, Mobile-Optimized) */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/35 bg-cyan-950/40 text-cyan-300 text-xs font-plex-mono backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold tracking-wide text-[11px] sm:text-xs">
                CYBER DEFENSE SYSTEM &bull; LIVE PROTECTION
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.15] font-unbounded">
              Protect Your Website, Brand &amp; Links from{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 drop-shadow-[0_0_35px_rgba(6,182,212,0.45)]">
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
                  variant="cyan"
                  className="w-full sm:w-auto text-xs font-semibold px-6 sm:px-8 py-3.5 font-plex-mono shadow-liquid-cyan"
                >
                  Scan a Link Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-semibold px-6 sm:px-7 py-3.5 font-plex-mono border-slate-700 bg-slate-900/60 hover:bg-slate-800"
                >
                  See How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Right: Live Threat Telemetry Console Panel */}
          <div className="lg:col-span-5 w-full">
            <div className={`rounded-3xl p-5 sm:p-7 relative overflow-hidden ${getCardClasses("border-cyan-500/40")}`}>
              {/* Scan Beam Effect */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 opacity-80" />

              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-unbounded">LIVE LINK SAFETY SCANNER</h3>
                    <p className="text-[10px] font-plex-mono text-cyan-400">INSTANT CHECKS &bull; ZERO RISK</p>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Risk Gauge Header */}
              <div className="my-4 sm:my-5 p-3.5 sm:p-4 rounded-2xl bg-[#070e1e]/80 border border-white/[0.08] flex items-center gap-3.5 sm:gap-4 relative overflow-hidden">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
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
                    HIGH RISK DETECTED
                  </span>
                  <p className="text-xs font-semibold text-white mt-0.5">Fake Website Impersonating Brand</p>
                  <p className="text-[10px] text-slate-400 font-plex-mono">Contains deceptive letters &bull; Steals passwords</p>
                </div>
              </div>

              {/* 4 Live Telemetry Findings (Clear, Intuitive) */}
              <div className="space-y-2 sm:space-y-2.5 font-plex-mono">
                {/* 1. Critical */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-red-500/25 flex items-center justify-between gap-2.5 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                      paypaI-security-login.com
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">
                      Fake login site trying to steal credentials
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-500/40 font-bold shrink-0">
                    Danger
                  </span>
                </div>

                {/* 2. Review */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-amber-500/25 flex items-center justify-between gap-2.5 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                      optimus-support-fake.net
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">
                      Copycat name created 2 days ago
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-400 border border-amber-500/40 font-bold shrink-0">
                    Warning
                  </span>
                </div>

                {/* 3. Matched */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-purple-500/25 flex items-center justify-between gap-2.5 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                      pastebin.com/raw/leak
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">
                      Company emails found in public leak
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-400 border border-purple-500/40 font-bold shrink-0">
                    Alert
                  </span>
                </div>

                {/* 4. Clear */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-emerald-500/25 flex items-center justify-between gap-2.5 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                      optimus-drp.io
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate">
                      Official verified company website
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold shrink-0">
                    Safe
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Row (Clean & Mobile-Compact) */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className={`rounded-3xl p-5 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 ${getCardClasses()}`}>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-cyan-400 font-unbounded">100+</p>
            <p className="text-[11px] sm:text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">
              Attacks Stopped
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-purple-400 font-unbounded">24/7</p>
            <p className="text-[11px] sm:text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">
              Active Monitoring
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-emerald-400 font-unbounded">&lt; 10s</p>
            <p className="text-[11px] sm:text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">
              Instant Scan Time
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-2xl sm:text-4xl font-extrabold text-pink-400 font-unbounded">0 - 100</p>
            <p className="text-[11px] sm:text-xs font-plex-mono text-slate-400 uppercase tracking-wider mt-1">
              Simple Risk Score
            </p>
          </div>
        </div>
      </section>

      {/* About Section (Simple Explanations) */}
      <section id="about" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-plex-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
            About OPTIMUS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-unbounded">
            Why You Need Protection Outside Firewalls
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-plex-sans">
            Traditional antivirus protects your laptop. OPTIMUS protects your brand, website, and customers on the public internet.
          </p>
        </div>

        <div className={`rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center ${getCardClasses()}`}>
          <div className="space-y-5">
            <h3 className="text-lg sm:text-2xl font-bold text-white font-unbounded">
              Stopping Scams Before They Reach Your Users
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              Most phishing attacks and online fraud don't hack your server directly. Instead, scammers buy similar domain names, copy your website logo, and send fake links to your customers.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              <strong className="text-cyan-400 font-semibold">OPTIMUS Digital Risk Protection</strong> watches the entire internet 24/7. When someone registers a fake copy of your website or leaks your credentials, you get an instant alert and a ready-to-use takedown report.
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

          {/* Simple Visual Diagram */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#070e20] border border-cyan-500/20 space-y-3.5">
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
            <div className="text-center text-xs font-plex-mono text-cyan-400 py-1 font-semibold flex items-center justify-center gap-2">
              <span>&darr;</span> Blocked &amp; Reported by OPTIMUS <span>&darr;</span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl border border-dashed border-emerald-500/40 bg-[#0a142c] text-center">
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

      {/* How It Works (3 Easy Steps) */}
      <section id="how-it-works" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-plex-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
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
          {/* Step 1 */}
          <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${getCardClasses("border-cyan-500/30")}`}>
            <div>
              <div className="h-11 w-11 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mb-5">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-plex-mono text-cyan-400 uppercase tracking-wider font-bold">STEP 01</span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-unbounded mt-1 mb-2.5">
                Paste or Monitor Links
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
                Paste any link, email, or domain into OPTIMUS. We also automatically scan newly registered domains across the web 24/7.
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.06] text-[11px] font-plex-mono text-cyan-300">
              &bull; Instant link checks &bull; Domain watchlist
            </div>
          </div>

          {/* Step 2 */}
          <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${getCardClasses("border-purple-500/30")}`}>
            <div>
              <div className="h-11 w-11 rounded-2xl bg-purple-950/70 border border-purple-500/40 text-purple-300 flex items-center justify-center mb-5">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-plex-mono text-purple-400 uppercase tracking-wider font-bold">STEP 02</span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-unbounded mt-1 mb-2.5">
                Instant Risk Analysis
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
                Get a clear safety score from 0 (safe) to 100 (dangerous). We check for lookalike letters, hidden redirects, and WHOIS details in seconds.
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.06] text-[11px] font-plex-mono text-purple-300">
              &bull; Clear 0-100 score &bull; Plain-English explanation
            </div>
          </div>

          {/* Step 3 */}
          <div className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${getCardClasses("border-red-500/30")}`}>
            <div>
              <div className="h-11 w-11 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-300 flex items-center justify-center mb-5">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-plex-mono text-red-400 uppercase tracking-wider font-bold">STEP 03</span>
              <h3 className="text-lg sm:text-xl font-bold text-white font-unbounded mt-1 mb-2.5">
                Fast Takedown &amp; Removal
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
                When a threat is confirmed, OPTIMUS prepares legal abuse notices so domain registrars and web hosts take down the malicious site.
              </p>
            </div>
            <div className="pt-5 border-t border-white/[0.06] text-[11px] font-plex-mono text-red-300">
              &bull; One-click report &bull; Threat neutralised
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Features (Intuitive, Simple Names) */}
      <section id="features" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-plex-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
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
          <div className={`rounded-3xl p-6 sm:p-7 border-t-4 border-t-cyan-400 flex flex-col justify-between ${getCardClasses("border-cyan-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">
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
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Spots typosquatting &amp; lookalike URLs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Explains why a link is risky in seconds</span>
              </div>
            </div>
          </div>

          {/* 2. Brand & Logo Defense */}
          <div className={`rounded-3xl p-6 sm:p-7 border-t-4 border-t-purple-400 flex flex-col justify-between ${getCardClasses("border-purple-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-500/30">
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
                <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Monitors unauthorized logo copying</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Catches fake customer service sites</span>
              </div>
            </div>
          </div>

          {/* 3. Phishing Email Inspector */}
          <div className={`rounded-3xl p-6 sm:p-7 border-t-4 border-t-pink-500 flex flex-col justify-between ${getCardClasses("border-pink-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-pink-950/80 border border-pink-500/30 text-pink-400 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 font-bold border border-pink-500/30">
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
                <Check className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                <span>Reveals the real sender email &amp; IP</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                <span>Verifies sender authentication flags</span>
              </div>
            </div>
          </div>

          {/* 4. Domain & WHOIS Explorer */}
          <div className={`rounded-3xl p-6 sm:p-7 border-t-4 border-t-amber-400 flex flex-col justify-between ${getCardClasses("border-amber-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Eye className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
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
                <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Domain age and creation timestamp</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>DNS mail records and name servers</span>
              </div>
            </div>
          </div>

          {/* 5. Stolen Password & Dark Web Watch */}
          <div className={`rounded-3xl p-6 sm:p-7 border-t-4 border-t-red-500 flex flex-col justify-between ${getCardClasses("border-red-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-red-950/80 border border-red-500/30 text-red-400 flex items-center justify-center">
                  <KeyRound className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-500/30">
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
                <Check className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>Immediate breach notification alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>Guides users to reset compromised keys</span>
              </div>
            </div>
          </div>

          {/* 6. BILY AI Assistant */}
          <div className={`rounded-3xl p-6 sm:p-7 border-t-4 border-t-emerald-400 flex flex-col justify-between ${getCardClasses("border-emerald-500/30")}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-plex-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
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
          <span className="text-xs font-plex-mono text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
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
          <div className={`rounded-3xl p-6 sm:p-8 ${getCardClasses("border-cyan-500/30")}`}>
            <div className="h-11 w-11 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mb-5">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2.5">
              Catch Scams Early
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              Find lookalike websites and fraudulent links before any employee or customer has a chance to click on them.
            </p>
          </div>

          <div className={`rounded-3xl p-6 sm:p-8 ${getCardClasses("border-amber-500/30")}`}>
            <div className="h-11 w-11 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-5">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-unbounded mb-2.5">
              Save Time &amp; Investigation Costs
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-plex-sans">
              Automated scoring replaces hours of manual WHOIS, DNS, and header checks with an instant 0-to-100 verdict.
            </p>
          </div>

          <div className={`rounded-3xl p-6 sm:p-8 ${getCardClasses("border-pink-500/30")}`}>
            <div className="h-11 w-11 rounded-2xl bg-pink-950/70 border border-pink-500/40 text-pink-300 flex items-center justify-center mb-5">
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
        <div className={`rounded-3xl p-7 sm:p-12 lg:p-16 text-center relative overflow-hidden bg-[#0d1a38] border border-cyan-500/40 shadow-[14px_18px_40px_rgba(2,6,18,0.9),inset_-6px_-6px_14px_rgba(0,0,0,0.6),inset_6px_6px_14px_rgba(255,255,255,0.08)]`}>
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
                  variant="cyan"
                  className="w-full sm:w-auto text-xs font-semibold px-6 sm:px-8 py-3.5 font-plex-mono shadow-liquid-cyan"
                >
                  Scan a Link Now Free
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-semibold px-6 sm:px-7 py-3.5 font-plex-mono border-white/10 bg-[#070e20] hover:bg-[#0c1630] text-slate-200 hover:text-white"
                >
                  Sign In to Console
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Mobile Friendly) */}
      <footer className="border-t border-white/[0.08] bg-[#040812] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative font-plex-mono text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="OPTIMUS"
            className="h-6 w-6 object-contain filter drop-shadow-[0_2px_6px_rgba(0,240,255,0.45)]"
          />
          <div>
            <span className="font-unbounded font-bold text-white">OPTIMUS</span> &bull; Cyber Defense Platform &copy; 2026.
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link href="/login" className="hover:text-cyan-400 transition-colors">
            Login
          </Link>
          <Link href="/analyzer" className="hover:text-cyan-400 transition-colors">
            Link Scanner
          </Link>
          <Link href="/register" className="hover:text-cyan-400 transition-colors">
            Register
          </Link>
        </div>
      </footer>
    </div>
  );
}
