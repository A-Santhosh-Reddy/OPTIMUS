"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  UserPlus,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "email-link" (Default high-protection) vs "password"
  const [authMode, setAuthMode] = useState<"email-link" | "password">("email-link");

  // Email link state
  const [emailInput, setEmailInput] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [directVerifyUrl, setDirectVerifyUrl] = useState<string | null>(null);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Password state
  const [passwordEmail, setPasswordEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Status feedback
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "google_not_configured") {
        setError("Google OAuth credentials are not configured yet in .env.local. Use the Email Verification Link below.");
      } else if (errorParam === "missing_oauth_code") {
        setError("Authorization code was not received. Please try again.");
      } else {
        setError(decodeURIComponent(errorParam));
      }
    }
  }, [searchParams]);

  // Handler: Send verification link to Gmail / Email
  const handleSendVerificationLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setError("Please enter a valid email address (e.g. yourname@gmail.com)");
      return;
    }

    setIsSendingLink(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/send-verification-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch verification link");
      }

      setIsLinkSent(true);
      setDirectVerifyUrl(data.directUrl || null);
      setSuccessMsg(`Secure verification email and 6-digit code sent to ${emailInput}! Check your inbox.`);
    } catch (err: any) {
      setError(err.message || "Failed to send verification email");
    } finally {
      setIsSendingLink(false);
    }
  };

  // Handler: Verify 6-digit code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || passcode.length < 6) {
      setError("Please enter the 6-digit code received in your email");
      return;
    }

    setIsVerifyingCode(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, code: passcode.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      setSuccessMsg("Verification confirmed! Opening console...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 500);
    } catch (err: any) {
      setError(err.message || "Code verification failed");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Handler: Traditional password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: passwordEmail, password }),
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
      setIsPasswordLoading(false);
    }
  };

  return (
    <Card glow="none" className="p-5 sm:p-8 backdrop-blur-2xl border-white/[0.08] bg-[#0e1526] shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#070e1c]/80 border border-white/[0.08] rounded-xl mb-5 font-mono text-xs backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setAuthMode("email-link");
            setError(null);
            setSuccessMsg(null);
          }}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            authMode === "email-link"
              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/25 border border-emerald-400/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Email Link / Gmail</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("password");
            setError(null);
            setSuccessMsg(null);
          }}
          className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            authMode === "password"
              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/25 border border-emerald-400/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Password</span>
        </button>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300 backdrop-blur-md mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-300 backdrop-blur-md mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
          <span className="leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* TAB 1: Real Email Verification Link & Passcode (High Security) */}
      {authMode === "email-link" && (
        <div className="space-y-4">
          {!isLinkSent ? (
            <form onSubmit={handleSendVerificationLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  Your Gmail or Corporate Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@gmail.com"
                    required
                    autoComplete="email"
                    className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 font-sans leading-normal">
                  We will send a genuine verification link and 6-digit code to this address for high-protection sign-in.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSendingLink}
                className="w-full font-semibold text-xs mt-2"
              >
                Send Verification Link to Gmail
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Quick Actions after link sent */}
              <div className="p-3.5 rounded-xl bg-[#0a1122] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Sent to: <strong className="text-sky-300">{emailInput}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLinkSent(false);
                      setPasscode("");
                    }}
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Change
                  </button>
                </div>

                {/* Direct Gmail Launcher Button */}
                <a
                  href={`https://mail.google.com/mail/u/0/#search/OPTIMUS+verification`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-200 text-xs font-semibold font-mono transition-all"
                >
                  <Mail className="h-4 w-4 text-red-400" />
                  <span>Open Gmail Inbox to Check Link</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
                </a>

                {/* 1-Click Direct Validation Option */}
                {directVerifyUrl && (
                  <div className="pt-2 border-t border-white/[0.08] text-center">
                    <a
                      href={directVerifyUrl}
                      className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 underline font-mono"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                      <span>Or Click Here for Instant 1-Click Verification</span>
                    </a>
                  </div>
                )}
              </div>

              {/* 6-Digit Passcode Input Form */}
              <form onSubmit={handleVerifyCode} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Enter 6-Digit Security Passcode
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 748291"
                      required
                      className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-sm tracking-widest text-center text-sky-300 placeholder-slate-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isVerifyingCode}
                  className="w-full font-semibold text-xs"
                >
                  Verify Code &amp; Enter Console
                  <ShieldCheck className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Traditional Password & Console Credentials */}
      {authMode === "password" && (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Email Address or Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={passwordEmail}
                onChange={(e) => setPasswordEmail(e.target.value)}
                placeholder="your.email@domain.com"
                required
                autoComplete="username"
                className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400/80">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="clay-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPasswordLoading}
            className="w-full font-semibold text-xs mt-3"
          >
            Sign In with Password
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      )}

      {/* Single Sign-On: Google & Microsoft */}
      <div className="mt-5">
        <OAuthButtons mode="login" />
      </div>

      {/* Register Prompt */}
      <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-[#0a1224]/80 hover:bg-[#0e1a33] hover:border-emerald-500/30 text-xs text-slate-300 hover:text-white transition-all font-mono w-full justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)] backdrop-blur-md"
        >
          <UserPlus className="h-4 w-4 text-teal-400" />
          <span>Need an account? <span className="underline font-bold text-white">Create New Credentials</span></span>
        </Link>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Aurora Borealis Ambient Light Curtains */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-emerald-500/22 via-teal-400/18 to-transparent blur-[140px] animate-aurora-1" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-indigo-500/24 via-purple-600/18 to-transparent blur-[150px] animate-aurora-2" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-teal-500/18 via-cyan-500/15 to-transparent blur-[135px] animate-aurora-3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2.5">
          <div className="relative inline-flex h-16 w-16 items-center justify-center">
            <img
              src="/logo.png"
              alt="OPTIMUS Cyber Defense"
              className="h-full w-full object-contain filter drop-shadow-[0_4px_20px_rgba(20,184,166,0.4)]"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent font-mono flex items-center justify-center gap-2">
            CYBER DEFENSE LOGIN
          </h1>
          <p className="text-xs text-slate-400 font-sans max-w-sm mx-auto leading-relaxed">
            Secure login with instant Gmail verification link, 6-digit passcode, or console credentials
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-8 text-center text-xs font-mono text-teal-400">Loading secure access...</div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
