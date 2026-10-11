"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Lock, Mail, ArrowRight, AlertCircle, UserPlus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "google_not_configured") {
        setError(
          "Google OAuth credentials are not configured yet in .env.local. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, or use Google Sign-in below."
        );
      } else if (errorParam === "missing_oauth_code") {
        setError("Google authorization code was not received. Please try again.");
      } else {
        setError(decodeURIComponent(errorParam));
      }
    }
  }, [searchParams]);

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

  return (
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
              placeholder="your.email@domain.com"
              required
              autoComplete="username"
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
              placeholder="Enter your password"
              required
              autoComplete="current-password"
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
          Sign In to Console
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </form>

      {/* Single Sign-On: Google & Microsoft */}
      <div className="mt-5">
        <OAuthButtons mode="login" />
      </div>

      {/* Register Prompt */}
      <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/40 text-xs text-cyan-300 hover:text-cyan-200 transition-all font-mono w-full justify-center"
        >
          <UserPlus className="h-4 w-4 text-cyan-400" />
          <span>Need an account? <span className="underline font-bold text-white">Create New Credentials</span></span>
        </Link>
      </div>
    </Card>
  );
}

export default function LoginPage() {
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
          <div className="relative inline-flex h-16 w-16 items-center justify-center">
            <img src="/logo.png" alt="OPTIMUS SOC Defense" className="h-full w-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,240,255,0.45)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center justify-center gap-2">
            SOC DEFENSE ACCESS
          </h1>
          <p className="text-xs text-cyan-300/70 font-mono">
            Authenticate with your credentials or SSO to access enterprise console
          </p>
        </div>

        <Suspense fallback={
          <div className="p-8 text-center text-xs font-mono text-cyan-400">Loading console access...</div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
