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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Aurora Borealis Ambient Light Curtains */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-emerald-500/22 via-teal-400/18 to-transparent blur-[140px] animate-aurora-1" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-indigo-500/24 via-purple-600/18 to-transparent blur-[150px] animate-aurora-2" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-teal-500/18 via-cyan-500/15 to-transparent blur-[135px] animate-aurora-3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2.5">
          <div className="relative inline-flex h-16 w-16 items-center justify-center">
            <img src="/logo.png" alt="OPTIMUS SOC Defense" className="h-full w-full object-contain filter drop-shadow-[0_4px_20px_rgba(20,184,166,0.4)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent font-mono">
            ANALYST REGISTRATION
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Provision a new security analyst account in the cyber defense matrix
          </p>
        </div>

        <Card glow="none" className="p-8 backdrop-blur-2xl border-white/[0.08] bg-[#0c1326]/75 shadow-[0_16px_48px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.1)]">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300 backdrop-blur-md">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Taylor Smith"
                  required
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                  <AtSign className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tsmith_secops"
                  required
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  required
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Organization / Team Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Acme Cyber Defend Unit"
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Password (Min. 6 Characters)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-semibold text-xs mt-3"
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
              className="text-xs text-slate-400 hover:text-sky-400 transition-colors font-mono"
            >
              Already have an account? <span className="underline font-medium text-sky-300">Sign in</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
