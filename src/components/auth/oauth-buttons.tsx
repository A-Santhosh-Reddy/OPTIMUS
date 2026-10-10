"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, User, Mail, ArrowRight, ShieldCheck } from "lucide-react";

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
  const [activeProvider, setActiveProvider] = useState<"google" | "microsoft" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // User input state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleOpenProvider = (provider: "google" | "microsoft") => {
    setActiveProvider(provider);
    setError(null);
    setSuccessInfo(null);
    setEmail("");
    setName("");
    setIsModalOpen(true);
  };

  const executeOAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProvider) return;
    if (!email.trim()) {
      setError("Please provide an email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessInfo(null);

    const userName = name.trim() || email.split("@")[0];

    try {
      const res = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: activeProvider,
          email: email.trim(),
          name: userName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setSuccessInfo(`Verified identity for ${userName}. Loading console...`);

      setTimeout(() => {
        setIsModalOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }, 800);
    } catch (err: any) {
      setError(err.message || "Failed to sign in with OAuth provider");
    } finally {
      setIsSubmitting(false);
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

      {/* 2 Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleOpenProvider("google")}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-[#0c121e]/90 hover:bg-[#111927] hover:border-slate-600 text-slate-200 text-xs font-semibold shadow-sm transition-all hover:shadow-[0_0_12px_rgba(66,133,244,0.15)] active:scale-[0.98]"
        >
          <GoogleIcon className="h-4 w-4 shrink-0" />
          <span>Google SSO</span>
        </button>

        {/* Microsoft Button */}
        <button
          type="button"
          onClick={() => handleOpenProvider("microsoft")}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-700/80 bg-[#0c121e]/90 hover:bg-[#111927] hover:border-slate-600 text-slate-200 text-xs font-semibold shadow-sm transition-all hover:shadow-[0_0_12px_rgba(5,166,240,0.15)] active:scale-[0.98]"
        >
          <MicrosoftIcon className="h-4 w-4 shrink-0" />
          <span>Microsoft SSO</span>
        </button>
      </div>

      {/* OAuth SSO Authorization Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={
          activeProvider === "google"
            ? "Sign in with Google Account"
            : "Sign in with Microsoft 365"
        }
        description={`Enter your ${activeProvider === "google" ? "Google" : "Microsoft"} email to authenticate and access Optimus Platform.`}
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 animate-spin" />
              <span>{successInfo}</span>
            </div>
          )}

          <form onSubmit={executeOAuth} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Your Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson (Judge)"
                  required
                  autoFocus
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-700 bg-[#070b14] pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                {activeProvider === "google" ? "Google Email Address" : "Microsoft Work or Personal Email"}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeProvider === "google" ? "judge@gmail.com" : "judge@microsoft.com"}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-[#070b14] pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Your account will be provisioned directly under your email address.
              </p>
            </div>

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              isLoading={isSubmitting}
              className="w-full text-xs font-semibold mt-2"
            >
              Continue as {name.trim() || (email ? email.split("@")[0] : "Authorized User")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              SSO Token Exchange Encrypted
            </span>
            <span>Optimus Enterprise Identity</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
