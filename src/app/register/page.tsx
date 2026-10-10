"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Lock, Mail, User, Building, ArrowRight, AlertCircle, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password, organizationName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Liquid Ambient Light Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="cyber-glow-orb -top-32 -left-32 w-[500px] h-[500px] bg-cyan-500/20" />
        <div className="cyber-glow-orb top-1/2 -right-40 w-[550px] h-[550px] bg-blue-600/15" />
        <div className="cyber-glow-orb -bottom-40 left-1/3 w-[500px] h-[500px] bg-indigo-600/20" />
        <div className="absolute inset-0 cyber-grid-overlay opacity-30" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2.5">
          <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 border border-cyan-400/40 p-2.5">
            <ShieldAlert className="h-7 w-7 drop-shadow-md" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse pointer-events-none" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            ANALYST REGISTRATION
          </h1>
          <p className="text-xs text-cyan-300/70 font-mono">
            Provision a new security analyst account in the cyber defense matrix
          </p>
        </div>

        <Card glow="cyber" hudCorner={true} className="p-8 backdrop-blur-2xl border-cyan-500/30">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/50 p-3.5 text-xs text-red-300 backdrop-blur-md">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-400/70">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Taylor Smith"
                  required
                  className="liquid-glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-400/70">
                  <AtSign className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tsmith_secops"
                  required
                  className="liquid-glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-400/70">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  required
                  className="liquid-glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Organization / Team Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-400/70">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Acme Cyber Defend Unit"
                  className="liquid-glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Password (Min. 6 Characters)
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
              Register & Initialize Analyst Console
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          {/* Google Sign-In */}
          <div className="mt-5">
            <OAuthButtons mode="register" />
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono"
            >
              Already have an account? <span className="underline font-medium text-cyan-300">Sign in</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
