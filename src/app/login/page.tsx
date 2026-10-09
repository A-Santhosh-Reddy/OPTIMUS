"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Lock, Mail, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const executeLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(email, password);
  };

  const handleDemoAccount = async (roleName: string, demoEmail: string, demoPass: string) => {
    setActiveRole(roleName);
    setEmail(demoEmail);
    setPassword(demoPass);
    // Instant 1-click seamless login for instant access
    await executeLogin(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Liquid Ambient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="cyber-glow-orb -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/20" />
        <div className="cyber-glow-orb top-1/2 -right-40 w-[550px] h-[550px] bg-blue-600/15" />
        <div className="cyber-glow-orb -bottom-40 left-1/3 w-[500px] h-[500px] bg-indigo-600/20" />
        <div className="absolute inset-0 cyber-grid-overlay opacity-30" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2.5">
          <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 border border-cyan-400/40 p-2.5">
            <ShieldAlert className="h-7 w-7 drop-shadow-md" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse pointer-events-none" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center justify-center gap-2">
            SOC DEFENSE ACCESS
          </h1>
          <p className="text-xs text-cyan-300/70 font-mono">
            Authenticate to access enterprise threat intelligence matrix
          </p>
        </div>

        <Card glow="cyber" hudCorner={true} className="p-6 sm:p-8 backdrop-blur-2xl border-cyan-500/30">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-950/60 p-3.5 text-xs text-red-300 backdrop-blur-md">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Email Address or Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-400/70">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@optimus-drp.io or username"
                  required
                  className="liquid-glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-400/70">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="liquid-glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              isLoading={isLoading}
              className="w-full font-semibold text-xs mt-3 shadow-liquid-cyan"
            >
              Authenticate &amp; Enter Console
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Single Sign-On: Google & Microsoft */}
          <div className="mt-5">
            <OAuthButtons mode="login" />
          </div>

          {/* 1-Click Quick Demo Role Access */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <p className="text-[11px] font-semibold text-slate-400 mb-2.5 flex items-center justify-between font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>1-Click Demo Access:</span>
              </span>
              <span className="text-[10px] text-cyan-400/80">Click to enter directly</span>
            </p>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoAccount("Admin", "admin@optimus-drp.io", "admin123!")}
                className={`p-2.5 rounded-xl border transition-all shadow-sm flex flex-col items-center justify-center gap-1 ${
                  activeRole === "Admin"
                    ? "border-cyan-400 bg-cyan-900/60 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    : "border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-300"
                }`}
              >
                <span className="font-bold">Admin</span>
                <span className="text-[9px] text-slate-400">Full SecOps</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoAccount("Analyst", "analyst@optimus-drp.io", "analyst123!")}
                className={`p-2.5 rounded-xl border transition-all shadow-sm flex flex-col items-center justify-center gap-1 ${
                  activeRole === "Analyst"
                    ? "border-blue-400 bg-blue-900/60 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                    : "border-blue-500/30 bg-blue-950/30 hover:bg-blue-900/50 text-blue-300"
                }`}
              >
                <span className="font-bold">Analyst</span>
                <span className="text-[9px] text-slate-400">Threat Hunter</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoAccount("Viewer", "viewer@optimus-drp.io", "viewer123!")}
                className={`p-2.5 rounded-xl border transition-all shadow-sm flex flex-col items-center justify-center gap-1 ${
                  activeRole === "Viewer"
                    ? "border-indigo-400 bg-indigo-900/60 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    : "border-slate-700/60 bg-slate-900/40 hover:bg-slate-800/60 text-slate-300"
                }`}
              >
                <span className="font-bold">Viewer</span>
                <span className="text-[9px] text-slate-400">Read-Only</span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/register"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono"
            >
              Need an analyst account? <span className="underline font-medium text-cyan-300">Register here</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
