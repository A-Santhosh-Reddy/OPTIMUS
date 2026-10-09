import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Layers,
  Radio,
  FileCheck2,
  Lock,
  ArrowRight,
  Activity,
  Fingerprint,
  Zap,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const capabilities = [
    {
      title: "Suspicious URL & Domain Heuristics",
      description:
        "Transparent 10+ rule detection engine analyzing Shannon entropy, raw IP hosts, multi-tier subdomains, and credential targeting paths with strict SSRF prevention.",
      icon: Search,
      badge: "Heuristic Engine",
    },
    {
      title: "Brand Protection & Typosquatting",
      description:
        "Proactively detect homoglyph character substitutions, Levenshtein edit distance variations, and subdomain brand hijacking against protected enterprise assets.",
      icon: Layers,
      badge: "Brand Shield",
    },
    {
      title: "Multi-Source Threat Intelligence",
      description:
        "Modular adapters for Google Safe Browsing, VirusTotal, and local IoC feeds clearly differentiating between confirmed matches, negative lookups, and unavailable services.",
      icon: Radio,
      badge: "Threat Intel",
    },
    {
      title: "Explainable Risk Scoring & AI Insights",
      description:
        "Deterministic 0–100 composite scoring model backed by structured evidence, uncertainty explanations, and actionable defensive mitigation steps.",
      icon: Activity,
      badge: "Explainable AI",
    },
    {
      title: "Incident Tracking & Case Management",
      description:
        "Full SOC incident response lifecycle from automated detection to investigation notes, analyst conclusions, false-positive tagging, and downloadable PDF forensic reports.",
      icon: FileCheck2,
      badge: "Incident Response",
    },
    {
      title: "Enterprise RBAC & Security Audit Logs",
      description:
        "Fine-grained role-based access control (Admin, Security Analyst, Viewer) with immutable security audit trails and multi-tenant organization isolation.",
      icon: Lock,
      badge: "Enterprise Security",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      {/* Liquid Ambient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="cyber-glow-orb -top-40 -left-40 w-[600px] h-[600px] bg-cyan-500/20" />
        <div className="cyber-glow-orb top-1/4 -right-48 w-[650px] h-[650px] bg-blue-600/20" />
        <div className="cyber-glow-orb top-2/3 left-1/3 w-[550px] h-[550px] bg-indigo-600/15" />
        <div className="cyber-glow-orb -bottom-48 right-10 w-[600px] h-[600px] bg-purple-600/15" />
        <div className="absolute inset-0 cyber-grid-overlay opacity-35" />
      </div>

      {/* Top Liquid Glass Header */}
      <header className="liquid-glass-header sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
              <ShieldAlert className="h-6 w-6 drop-shadow-md" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse pointer-events-none" />
            </div>
            <div className="min-w-0">
              <span className="text-base font-bold tracking-wider text-white flex items-center gap-2 font-mono">
                OPTIMUS{" "}
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-semibold flex-shrink-0">
                  DRP MATRIX
                </span>
              </span>
              <p className="text-[10px] text-cyan-300/70 font-mono tracking-tight hidden sm:block truncate">
                Digital Risk Protection & Threat Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="cyan" size="sm" className="text-xs shadow-liquid-cyan">
                Open SOC Console
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 hidden sm:inline-block" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full border border-cyan-500/35 bg-gradient-to-r from-cyan-950/60 via-slate-900/60 to-blue-950/60 text-cyan-300 text-xs font-medium mb-6 sm:mb-8 backdrop-blur-xl shadow-liquid-cyan max-w-full">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
          </span>
          <span className="tracking-wide font-mono text-[10px] sm:text-[11px] truncate">
            NEXT-GEN LIQUID CYBERDEFENSE MATRIX &bull; ACTIVE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15] sm:leading-[1.1]">
          Real-Time Digital Risk Protection &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.45)]">
            Brand Impersonation Defense
          </span>
        </h1>

        <p className="mt-6 sm:mt-7 text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed px-2">
          Autonomous evidence-based threat detection, transparent Shannon entropy heuristics, 
          and explainable cyber intelligence in a state-of-the-art Liquid Glass interface.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" variant="cyan" className="text-sm font-semibold w-full sm:w-auto px-8 shadow-liquid-cyan">
              Launch SOC Operations
              <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
            </Button>
          </Link>
          <Link href="/analyzer" className="w-full sm:w-auto">
            <Button size="lg" variant="liquid" className="text-sm font-semibold w-full sm:w-auto px-7">
              <Search className="h-4 w-4 mr-2 text-cyan-400 flex-shrink-0" />
              Live Threat Vector Analyzer
            </Button>
          </Link>
        </div>

        {/* Interactive Holographic Threat Preview Card */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto liquid-glass-card rounded-2xl p-5 sm:p-7 md:p-8 text-left border border-cyan-500/30 shadow-2xl relative hud-corner overflow-hidden">
          {/* Scanning Line Effect */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-cyber-scan pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              <div className="h-10 w-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0">
                <Fingerprint className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] sm:text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                  Live Heuristic Telemetry Stream
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-100 font-mono mt-1 break-all sm:break-normal sm:truncate">
                  https://login.microsoft.com.account-update-portal.xyz/verify
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
              <span className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-red-950/80 text-red-400 border border-red-500/40 font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] whitespace-nowrap">
                CRITICAL RISK: 85/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Attack Vector</span>
              <p className="text-cyan-300 font-semibold mt-1.5 text-sm">Subdomain Brand Hijack</p>
              <p className="text-[11px] text-slate-400 mt-1">Targets Microsoft 365 tokens</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Inspection Security</span>
              <p className="text-emerald-400 font-semibold mt-1.5 text-sm">100% SSRF Protected</p>
              <p className="text-[11px] text-slate-400 mt-1">Offline lexical parsing</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Threat Feed</span>
              <p className="text-purple-400 font-semibold mt-1.5 text-sm">APWG IoC Confirmed</p>
              <p className="text-[11px] text-slate-400 mt-1">Active phishing campaign</p>
            </div>
          </div>
        </div>

        {/* Live Metrics Showcase Banner */}
        <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="liquid-glass-card rounded-2xl p-5 border border-cyan-500/25 flex flex-col justify-between min-h-[115px]">
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Detection Logic</p>
            <p className="text-2xl font-bold font-mono text-cyan-400 my-1">10+ Heuristics</p>
            <p className="text-[11px] text-slate-400">Shannon entropy &amp; homoglyphs</p>
          </div>
          <div className="liquid-glass-card rounded-2xl p-5 border border-emerald-500/25 flex flex-col justify-between min-h-[115px]">
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Defense Safety</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 my-1">Zero SSRF</p>
            <p className="text-[11px] text-slate-400">No untrusted outbound fetches</p>
          </div>
          <div className="liquid-glass-card rounded-2xl p-5 border border-blue-500/25 flex flex-col justify-between min-h-[115px]">
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Scoring Model</p>
            <p className="text-2xl font-bold font-mono text-blue-400 my-1">0–100 Score</p>
            <p className="text-[11px] text-slate-400">Deterministic composite score</p>
          </div>
          <div className="liquid-glass-card rounded-2xl p-5 border border-purple-500/25 flex flex-col justify-between min-h-[115px]">
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">SOC Output</p>
            <p className="text-2xl font-bold font-mono text-purple-400 my-1">PDF Forensics</p>
            <p className="text-[11px] text-slate-400">Executive incident reports</p>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono mb-4">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            CYBERPROTECTION MODULES
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Defensive Threat Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto px-2">
            Engineered from first principles with deterministic detection logic, zero synthetic data, and military-grade glass UI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="liquid-glass-card rounded-2xl p-6 sm:p-7 hover:border-cyan-400/50 transition-all duration-300 hud-corner group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/30 text-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex-shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-500/25 flex-shrink-0">
                      {cap.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{cap.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Liquid Cyber Security Callout */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto relative z-10 text-center">
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-10 md:p-14 border border-cyan-500/35 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              Instant Deployment Ready
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Protect Your Enterprise Assets in Seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-2">
              Equip your security analysts with transparent threat detection, explainable risk models, and audit-ready reporting.
            </p>
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="cyan" className="shadow-liquid-cyan px-8 w-full sm:w-auto">
                  Create Analyst Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="px-6 w-full sm:w-auto">
                  Sign In with Existing Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#030610]/90 backdrop-blur-xl py-8 px-4 sm:px-6 text-center text-xs text-slate-500 relative z-10">
        <p className="font-mono tracking-wider text-[11px] sm:text-xs">
          OPTIMUS DRP PLATFORM &bull; LIQUID GLASS CYBERPROTECTION MATRIX &bull; COMPATIBLE WITH MYSQL &amp; SUPABASE
        </p>
      </footer>
    </div>
  );
}
