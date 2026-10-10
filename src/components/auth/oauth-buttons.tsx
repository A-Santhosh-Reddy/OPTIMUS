"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, User, Mail, ArrowRight, ShieldCheck, KeyRound, Loader2 } from "lucide-react";

export function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

export function MicrosoftIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 23 23">
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}

interface OAuthButtonsProps {
  onSuccess?: () => void;
  mode?: "login" | "register";
}

export function OAuthButtons({ onSuccess, mode = "login" }: OAuthButtonsProps) {
  const router = useRouter();
  const [redirectingProvider, setRedirectingProvider] = useState<"google" | "microsoft" | null>(null);
  const [activeDemoProvider, setActiveDemoProvider] = useState<"google" | "microsoft" | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [demoSuccess, setDemoSuccess] = useState<string | null>(null);

  // Demo user input state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Real OAuth redirect handler
  const handleRealOAuth = (provider: "google" | "microsoft") => {
    setRedirectingProvider(provider);
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  // Open simulated SSO for quick local testing without API keys
  const handleOpenDemoModal = (provider: "google" | "microsoft") => {
    setActiveDemoProvider(provider);
    setDemoError(null);
    setDemoSuccess(null);
    setEmail("");
    setName("");
    setIsDemoModalOpen(true);
  };

  const executeDemoOAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDemoProvider) return;
    if (!email.trim()) {
      setDemoError("Please provide an email address.");
      return;
    }

    setIsDemoSubmitting(true);
    setDemoError(null);
    setDemoSuccess(null);

    const userName = name.trim() || email.split("@")[0];

    try {
      const res = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: activeDemoProvider,
          email: email.trim(),
          name: userName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setDemoSuccess(`Verified identity for ${userName}. Loading console...`);

      setTimeout(() => {
        setIsDemoModalOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }, 700);
    } catch (err: any) {
      setDemoError(err.message || "Failed to sign in with OAuth provider");
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-700/60"></div>
        <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Or Continue With Single Sign-On
        </span>
        <div className="flex-grow border-t border-slate-700/60"></div>
      </div>

      {/* Real OAuth Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Google SSO Button */}
        <button
          type="button"
          disabled={redirectingProvider !== null}
          onClick={() => handleRealOAuth("google")}
          className="relative flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-[#0c121e]/90 hover:bg-[#111927] hover:border-cyan-500/50 text-slate-200 text-xs font-semibold shadow-sm transition-all hover:shadow-[0_0_12px_rgba(66,133,244,0.2)] active:scale-[0.98] disabled:opacity-60"
        >
          {redirectingProvider === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          ) : (
            <GoogleIcon className="h-4 w-4 shrink-0" />
          )}
          <span>{redirectingProvider === "google" ? "Connecting..." : "Google SSO"}</span>
        </button>

        {/* Microsoft SSO Button */}
        <button
          type="button"
          disabled={redirectingProvider !== null}
          onClick={() => handleRealOAuth("microsoft")}
          className="relative flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-[#0c121e]/90 hover:bg-[#111927] hover:border-cyan-500/50 text-slate-200 text-xs font-semibold shadow-sm transition-all hover:shadow-[0_0_12px_rgba(5,166,240,0.2)] active:scale-[0.98] disabled:opacity-60"
        >
          {redirectingProvider === "microsoft" ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          ) : (
            <MicrosoftIcon className="h-4 w-4 shrink-0" />
          )}
          <span>{redirectingProvider === "microsoft" ? "Connecting..." : "Microsoft SSO"}</span>
        </button>
      </div>

      {/* Demo / Local Testing Fallback Option */}
      <div className="text-center pt-1">
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
          <span>Testing locally without OAuth keys?</span>
          <button
            type="button"
            onClick={() => handleOpenDemoModal("google")}
            className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1 transition-colors"
          >
            <KeyRound className="h-3 w-3" />
            Quick Demo SSO
          </button>
        </div>
      </div>

      {/* Demo SSO Authorization Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => !isDemoSubmitting && setIsDemoModalOpen(false)}
        title={
          activeDemoProvider === "google"
            ? "Quick Demo Sign-In (Google)"
            : "Quick Demo Sign-In (Microsoft)"
        }
        description={`Fast-track authentication for hackathon evaluation and local testing without OAuth configuration.`}
      >
        <div className="space-y-4">
          {demoError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{demoError}</span>
            </div>
          )}

          {demoSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 animate-spin" />
              <span>{demoSuccess}</span>
            </div>
          )}

          <div className="flex gap-2 p-1 bg-slate-900/60 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveDemoProvider("google")}
              className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                activeDemoProvider === "google"
                  ? "bg-cyan-950 border border-cyan-500/40 text-cyan-200"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GoogleIcon className="h-3.5 w-3.5" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveDemoProvider("microsoft")}
              className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                activeDemoProvider === "microsoft"
                  ? "bg-cyan-950 border border-cyan-500/40 text-cyan-200"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MicrosoftIcon className="h-3.5 w-3.5" />
              <span>Microsoft</span>
            </button>
          </div>

          <form onSubmit={executeDemoOAuth} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Analyst Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  required
                  autoFocus
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-700 bg-[#070b14] pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                {activeDemoProvider === "google" ? "Google Email" : "Microsoft Corporate Email"}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeDemoProvider === "google"
                      ? "analyst@gmail.com"
                      : "analyst@enterprise.com"
                  }
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-[#070b14] pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              isLoading={isDemoSubmitting}
              className="w-full text-xs font-semibold mt-2"
            >
              Sign In Instantly as {name.trim() || (email ? email.split("@")[0] : "Authorized User")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Demo Session Token Generation
            </span>
            <span>Optimus Enterprise Identity</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
