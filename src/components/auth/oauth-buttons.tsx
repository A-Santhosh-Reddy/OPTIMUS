"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
  KeyRound,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

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

  // Verification step state
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isLinkDispatched, setIsLinkDispatched] = useState(false);
  const [directVerifyUrl, setDirectVerifyUrl] = useState<string | null>(null);

  const handleGoogleSignInClick = async () => {
    setError(null);
    setSuccessInfo(null);
    setIsRedirecting(true);

    try {
      const supabase = createSupabaseClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/auth/callback`;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (oauthError) {
        setIsRedirecting(false);
        setIsModalOpen(true);
      }
    } catch {
      setIsRedirecting(false);
      setIsModalOpen(true);
    }
  };

  const handleSendLink = async (targetEmail: string) => {
    const finalEmail = targetEmail.trim();
    if (!finalEmail || !finalEmail.includes("@")) {
      setError("Please provide a valid Gmail address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const res = await fetch("/api/auth/send-verification-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: finalEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch verification email");
      }

      setIsLinkDispatched(true);
      setDirectVerifyUrl(data.directUrl || null);
      setSuccessInfo(`Security verification sent to ${finalEmail}! Check your Gmail.`);
    } catch (err: any) {
      setError(err.message || "Failed to send verification link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || passcode.length < 6) {
      setError("Please enter the 6-digit code received in your email");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: passcode.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      setSuccessInfo("Verified! Entering console...");
      setTimeout(() => {
        setIsModalOpen(false);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }, 500);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
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
        className="w-full relative flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08] bg-[#0c121e]/95 hover:bg-[#111927] hover:border-blue-500/40 text-slate-100 text-xs font-semibold shadow-md transition-all hover:shadow-[0_0_16px_rgba(37,99,235,0.25)] active:scale-[0.98] disabled:opacity-60"
      >
        {isRedirecting ? (
          <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
        ) : (
          <GoogleIcon className="h-4 w-4 shrink-0" />
        )}
        <span className="font-medium tracking-wide">
          {mode === "register" ? "Sign up with Google" : "Sign in with Google"}
        </span>
      </button>

      {/* Real Google Account Verification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Google Verification Link & Protection"
        description="Verify your Google email address to access the security operations console with maximum protection."
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
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successInfo}</span>
            </div>
          )}

          {!isLinkDispatched ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  Your Gmail Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                    autoFocus
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-700 bg-[#070b14] pl-9 pr-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                onClick={() => handleSendLink(email)}
                className="w-full text-xs font-semibold"
              >
                Send Verification Link to Gmail
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#101a30] border border-blue-500/25 space-y-2">
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-200 text-xs font-semibold transition-all"
                >
                  <Mail className="h-4 w-4 text-red-400" />
                  <span>Open Gmail Inbox</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                </a>

                {directVerifyUrl && (
                  <div className="text-center pt-1">
                    <a
                      href={directVerifyUrl}
                      className="text-[11px] text-sky-400 hover:underline flex items-center justify-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Or Click Here to Complete Instant Verification</span>
                    </a>
                  </div>
                )}
              </div>

              <form onSubmit={handleVerifyPasscode} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                    Enter 6-Digit Passcode from Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 748291"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-[#070b14] pl-9 pr-3 py-2.5 text-center text-sm tracking-widest text-sky-300 focus:border-blue-500 focus:outline-none font-mono font-bold"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full text-xs font-semibold"
                >
                  Verify Code &amp; Launch Console
                  <ShieldCheck className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Verified Gmail Protection
            </span>
            <span>Optimus Security</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
