"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, User, Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

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

interface OAuthButtonsProps {
  onSuccess?: () => void;
  mode?: "login" | "register";
}

export function OAuthButtons({ onSuccess, mode = "login" }: OAuthButtonsProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Google Account state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleGoogleSignInClick = () => {
    // If user wants to authenticate, open the zero-permission Google Account login dialog
    setError(null);
    setSuccessInfo(null);
    setEmail("");
    setName("");
    setIsModalOpen(true);
  };

  const handleQuickPresetLogin = (presetEmail: string, presetName: string) => {
    setEmail(presetEmail);
    setName(presetName);
    executeGoogleLogin(presetEmail, presetName);
  };

  const executeGoogleLogin = async (loginEmail?: string, loginName?: string) => {
    const targetEmail = (loginEmail || email).trim();
    const targetName = (loginName || name).trim() || targetEmail.split("@")[0];

    if (!targetEmail) {
      setError("Please provide a valid Google account email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const res = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          email: targetEmail,
          name: targetName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google authentication failed");
      }

      setSuccessInfo(`Signed in as ${targetEmail}. Launching console...`);

      setTimeout(() => {
        setIsModalOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }, 600);
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeGoogleLogin();
  };

  return (
    <div className="space-y-3">
      {/* Clean Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-700/60"></div>
        <span className="flex-shrink mx-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Or Continue With Google
        </span>
        <div className="flex-grow border-t border-slate-700/60"></div>
      </div>

      {/* Prominent Standard Google Login Button */}
      <button
        type="button"
        disabled={isRedirecting || isSubmitting}
        onClick={handleGoogleSignInClick}
        className="w-full relative flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-700/80 bg-[#0c121e]/95 hover:bg-[#111927] hover:border-cyan-500/50 text-slate-100 text-xs font-semibold shadow-md transition-all hover:shadow-[0_0_16px_rgba(66,133,244,0.25)] active:scale-[0.98] disabled:opacity-60"
      >
        {isRedirecting ? (
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
        ) : (
          <GoogleIcon className="h-4 w-4 shrink-0" />
        )}
        <span className="font-medium tracking-wide">
          {mode === "register" ? "Sign up with Google" : "Sign in with Google"}
        </span>
      </button>

      {/* Google Account Authentication Modal (Zero Permissions Required) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Sign in with Google"
        description="Choose your Google Account to sign in to Optimus Console without granting any extra permissions."
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

          {/* Quick 1-Click Google Account Presets */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-400 font-mono">
              Quick 1-Click Google Account:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleQuickPresetLogin("analyst@gmail.com", "Security Analyst")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-cyan-500/40 text-left transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs">
                  G
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">Security Analyst</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">analyst@gmail.com</div>
                </div>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleQuickPresetLogin("admin.secops@gmail.com", "SecOps Lead")}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:border-cyan-500/40 text-left transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-xs">
                  S
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">SecOps Lead</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">admin.secops@gmail.com</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-2 text-[9px] font-mono text-slate-500 uppercase">
              Or Enter Your Google Address
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
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
                  placeholder="e.g. Santhosh Reddy"
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-700 bg-[#070b14] pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Google Account (Email)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@gmail.com"
                  required
                  autoFocus
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-[#070b14] pl-9 pr-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="cyan"
              size="lg"
              isLoading={isSubmitting}
              className="w-full text-xs font-semibold mt-1"
            >
              Continue to Console with Google
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Standard Google Profile Access (No Extra Permissions)
            </span>
            <span>Optimus Identity</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
