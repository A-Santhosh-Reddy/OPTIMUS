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
    <div className="min-h-screen bg-[#062321] text-[#E7F4F1] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Depth Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#00DCC2]/[0.06] via-[#0B302D]/30 to-transparent blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#00BFA9]/[0.05] via-[#082E2B]/40 to-transparent blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#00DCC2]/[0.05] via-[#0B302D]/30 to-transparent blur-[135px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,220,194,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,220,194,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2.5">
          <div className="relative inline-flex h-16 w-16 items-center justify-center">
            <img src="/logo.png" alt="OPTIMUS SOC Defense" className="h-full w-full object-contain filter drop-shadow-[0_4px_20px_rgba(0,220,194,0.3)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E7F4F1] font-mono">
            ANALYST REGISTRATION
          </h1>
          <p className="text-xs text-[#A0B8B2] font-mono">
            Provision a new security analyst account in the cyber defense matrix
          </p>
        </div>

        <Card glow="none" className="p-8 backdrop-blur-2xl border-[#28504A] bg-[#112624] shadow-[0_16px_48px_rgba(3,28,27,0.7),inset_0_1px_0_rgba(0,220,194,0.08)]">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-[#FF6474]/40 bg-[#0B302D] p-3.5 text-xs text-[#FF6474] backdrop-blur-md">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#FF6474]" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A0B8B2] mb-1.5 font-mono">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#00DCC2]/80">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Taylor Smith"
                  required
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E7F4F1] placeholder-[#718C85] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0B8B2] mb-1.5 font-mono">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#00DCC2]/80">
                  <AtSign className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tsmith_secops"
                  required
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E7F4F1] placeholder-[#718C85] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0B8B2] mb-1.5 font-mono">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#00DCC2]/80">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  required
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E7F4F1] placeholder-[#718C85] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0B8B2] mb-1.5 font-mono">
                Organization / Team Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#00DCC2]/80">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Acme Cyber Defend Unit"
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E7F4F1] placeholder-[#718C85] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0B8B2] mb-1.5 font-mono">
                Password (Min. 6 Characters)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#00DCC2]/80">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E7F4F1] placeholder-[#718C85]"
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
              className="text-xs text-[#718C85] hover:text-[#00DCC2] transition-colors font-mono"
            >
              Already have an account? <span className="underline font-medium text-[#00DCC2]">Sign in</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
