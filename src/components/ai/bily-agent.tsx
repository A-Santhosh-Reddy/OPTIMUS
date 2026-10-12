"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  RotateCcw,
  Minimize2,
  Maximize2,
  ShieldAlert,
  Terminal,
  ChevronDown,
  Loader2,
  Check,
  Copy,
} from "lucide-react";

import { useLanguage } from "@/context/language-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Analyze suspicious link",
  "Explain typosquatting score",
  "Incident response playbook",
  "How to configure SSO?",
];

export function BilyAgent() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `### Greetings, Analyst! I am **Bily** 🛡️
I am your **AI Cyber Threat Intelligence Copilot** embedded in the Optimus Platform.

Ask me anything about:
* **Suspicious URLs & Domain Analysis**
* **Brand Impersonation & Typosquatting**
* **Incident Triage & Containment Playbooks**
* **Security Telemetry & Platform Features**

Select a prompt below or type your question:`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/bily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ **Analyst Notice**: Unable to reach threat intelligence backend (${err.message}). Please verify your network connection or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: `### Chat History Cleared 🧹\nReady for new telemetry analysis. What would you like to investigate?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Render formatted markdown-like text
  const renderFormattedMessage = (content: string) => {
    return content.split("\n").map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-bold text-white text-xs sm:text-sm mt-2 mb-1 flex items-center gap-1.5 font-mono">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300 ml-1 my-0.5 leading-relaxed">
            <span className="text-cyan-400 mt-0.5">•</span>
            <span>{parseInlineStyles(line.replace(/^[*|-]\s+/, ""))}</span>
          </div>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        return (
          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300 ml-1 my-0.5 leading-relaxed">
            <span className="text-cyan-400 font-mono font-semibold">{line.match(/^\d+\./)?.[0]}</span>
            <span>{parseInlineStyles(line.replace(/^\d+\.\s+/, ""))}</span>
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-200 leading-relaxed my-0.5">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  const parseInlineStyles = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="px-1.5 py-0.5 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 rounded text-[11px] font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-full bg-gradient-to-r from-[#0d162a]/95 via-[#101b33]/95 to-[#0b1324]/95 border border-blue-500/30 hover:border-blue-400/60 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_20px_rgba(37,99,235,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open Bily AI Threat Copilot"
        >
          {/* Optimus Prime Premium Emblem with Live Radar Dot */}
          <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-[#101c36] to-[#0a1122] border border-blue-500/30 p-1 shadow-[0_2px_8px_rgba(37,99,235,0.25)] group-hover:border-blue-400/60 transition-all shrink-0">
            <img
              src="/bily-avatar.png"
              alt="Bily Agent"
              className="h-full w-full object-contain filter drop-shadow-[0_2px_6px_rgba(37,99,235,0.5)]"
            />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </span>
          </div>

          <span className="text-sm font-extrabold tracking-widest font-mono text-sky-300 group-hover:text-white drop-shadow-[0_1px_4px_rgba(37,99,235,0.4)]">
            BILY
          </span>
        </button>
      )}

      {/* Expanded Floating Chat Panel */}
      {isOpen && (
        <div
          className={`flex flex-col bg-[#0c1220]/95 backdrop-blur-2xl border border-white/[0.1] shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(37,99,235,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-2xl overflow-hidden transition-all duration-300 ${
            isMinimized
              ? "w-80 h-14"
              : "w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0e1628]/95 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-[#101c36] to-[#0a1122] border border-blue-500/30 p-1 shadow-md shrink-0">
                <img
                  src="/bily-avatar.png"
                  alt="Bily Agent"
                  className="h-full w-full object-contain filter drop-shadow-[0_2px_6px_rgba(37,99,235,0.5)]"
                />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white font-mono tracking-wider">
                    BILY
                  </h3>
                  <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  Autonomous SecOps Copilot
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              {!isMinimized && (
                <button
                  onClick={clearChat}
                  title="Clear history"
                  className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximize" : "Minimize"}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="h-3.5 w-3.5" />
                ) : (
                  <Minimize2 className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg hover:bg-red-950/60 hover:text-red-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-transparent via-[#060a16]/40 to-[#040711]/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        {msg.role === "user" ? (
                          "SecOps Analyst"
                        ) : (
                          <>
                            <img src="/bily-avatar.png" alt="Bily" className="h-3.5 w-3.5 object-contain inline-block filter drop-shadow-[0_1px_3px_rgba(37,99,235,0.5)]" />
                            <span className="text-sky-400 font-bold">Bily</span>
                          </>
                        )}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div
                      className={`relative group max-w-[88%] rounded-2xl p-3 text-xs shadow-md transition-all ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm border border-blue-400/30"
                          : "bg-[#0f172a]/90 border border-white/[0.08] hover:border-blue-500/30 text-slate-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div>{renderFormattedMessage(msg.content)}</div>
                      )}

                      {/* Copy snippet button */}
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.content)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-sky-300 transition-all text-[10px]"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-[#101c36] to-[#0a1122] border border-blue-500/30 p-1 flex items-center justify-center shrink-0 shadow-md">
                      <img src="/bily-avatar.png" alt="Bily" className="h-full w-full object-contain animate-pulse filter drop-shadow-[0_1px_4px_rgba(37,99,235,0.5)]" />
                    </div>
                    <div className="p-3 rounded-2xl bg-[#0f172a]/90 border border-blue-500/30 text-slate-300 text-xs flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />
                      <span className="font-mono text-[11px] text-sky-300">
                        {t("Bily analyzing threat vectors...")}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts (visible when 2 or fewer messages) */}
              {messages.length <= 3 && !isLoading && (
                <div className="px-3 py-1.5 bg-[#090e1c]/80 border-t border-white/[0.06]">
                  <p className="text-[10px] text-slate-400 font-mono mb-1.5 flex items-center gap-1">
                    <Terminal className="h-3 w-3 text-sky-400" />
                    Recommended queries:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#0e172a] hover:bg-[#14203a] border border-white/[0.08] hover:border-blue-500/30 text-slate-300 hover:text-sky-300 transition-all font-mono"
                      >
                        {t(prompt)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#0e1628]/95 border-t border-white/[0.08]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    placeholder={t("Ask Bily about threats, URLs, or SOC playbooks...")}
                    className="flex-1 bg-[#090d16] border border-slate-700/80 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="h-8 w-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </button>
                </form>
                <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500 font-mono px-1">
                  <span>Press Enter to send</span>
                  <span className="flex items-center gap-1 text-sky-400/80">
                    <ShieldAlert className="h-2.5 w-2.5" />
                    Optimus Cyber Copilot
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
