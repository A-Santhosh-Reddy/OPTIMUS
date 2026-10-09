"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Terminal,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";
import { Button } from "../ui/button";

interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  "How does SSRF prevention work?",
  "Explain the 0-100 risk scoring model",
  "How do I switch between MySQL and Supabase?",
  "What are the platform keyboard hotkeys?",
  "How do I handle a critical domain takedown?",
];

export function AiHelpAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-01",
      sender: "agent",
      text: "Greetings, Analyst. I am the **Optimus SOC Cyber Copilot**.\n\nI can assist you with real-time threat heuristics, SSRF security architecture, database configuration (MySQL / Supabase), and platform keyboard shortcuts. What would you like to investigate?",
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("ssrf") || q.includes("server-side") || q.includes("forgery") || q.includes("safe")) {
      return `### 🛡️ SSRF-Safe Lexical Inspection Architecture
Traditional vulnerability scanners send outbound HTTP/GET requests to submitted URLs, making them vulnerable to **Server-Side Request Forgery (SSRF)** attacks (e.g., querying cloud metadata at \`169.254.169.254\` or attacking private intranet services).

**Optimus eliminates this vulnerability by design:**
1. **100% In-Memory Parsing**: We break down URL strings, hostnames, query paths, and TLDs strictly offline using lexical parsing algorithms.
2. **Zero Outbound Target Sockets**: We never send HTTP requests or ping target IP hosts.
3. **Internal IP Guard**: Private ranges (\`127.0.0.1\`, \`10.0.0.0/8\`, \`192.168.0.0/16\`) are flagged as critical network anomalies without resolving or connecting to them.`;
    }

    if (q.includes("score") || q.includes("scoring") || q.includes("0-100") || q.includes("metric") || q.includes("risk")) {
      return `### 📊 Deterministic 0–100 Risk Scoring Model
Optimus evaluates each digital asset against multiple weighted heuristics to compute a composite threat score:

- **🔴 Critical (70–100)**: Active impersonation, brand homoglyph typo with credential path, or confirmed threat intel match. Triggers urgent takedown workflow.
- **🟠 High (40–69)**: Multi-tiered subdomains, high-entropy DGA domain, or masked executable extension (\`.pdf.exe\`).
- **🟡 Medium (20–39)**: Dynamic DNS hosts (\`ddns.net\`), free low-reputation TLDs (\`.tk\`), or open redirect query parameters.
- **🔵 Low (0–19)**: Benign corporate domain or official verified brand asset.`;
    }

    if (q.includes("supabase") || q.includes("mysql") || q.includes("database") || q.includes("db") || q.includes("switch")) {
      return `### 🗄️ Database Management & Terminal Commands
Optimus includes built-in auto-sync scripts to toggle between local MySQL, cloud Supabase (PostgreSQL), and SQLite.

**1. Switch to Supabase:**
\`\`\`bash
node scripts/switch-db.js postgresql "YOUR_SUPABASE_URI"
npm run db:push
npm run db:seed
\`\`\`

**2. Switch to Local MySQL:**
\`\`\`bash
node scripts/switch-db.js mysql
\`\`\`

**3. Run Database Connection Health Check:**
\`\`\`bash
node scripts/check-db.js
\`\`\`
*(Tip: In MySQL passwords with special characters like \`@\`, our engine automatically encodes them to \`%40\` at runtime to avoid connection parsing errors).*`;
    }

    if (q.includes("hotkey") || q.includes("shortcut") || q.includes("keyboard") || q.includes("key")) {
      return `### ⌨️ Active Keyboard Hotkeys
Accelerate your security operations workflow with these global hotkeys:

- **\`Ctrl + A\`** (or **\`Cmd + A\`**): Instant jump to the **URL & Threat Analyzer** from any page.
- **\`Esc\`**: Dismiss any open holographic modal dialog or popup.
- **\`Enter\`**: Submit URL input for automated lexical inspection.
- **\`Ctrl + P\`**: Print or export forensic reports on Findings and Incident views.`;
    }

    if (q.includes("takedown") || q.includes("incident") || q.includes("case") || q.includes("investigate")) {
      return `### 🚨 Incident Takedown & Case Management
When a suspicious asset exceeds the Critical threshold (>= 70):
1. Navigate to **Incident Cases** (\`/incidents\`).
2. Open the active incident to review the evidence trail and Shannon entropy metrics.
3. Add investigation notes (e.g. registrar details, DNS sinkhole status).
4. Click **"Download PDF Forensic Report"** to export an executive evidence report formatted for legal registrars and Cloudflare abuse takedowns.`;
    }

    if (q.includes("shannon") || q.includes("entropy")) {
      return `### 📈 Shannon Entropy Detection
Shannon entropy quantifies the randomness of characters in a domain name. 
- Legitimate domains typically measure between **2.0 and 3.2 bits/byte** (e.g. \`microsoft.com\`).
- Algorithmic Domain Generation (DGA) or credential-harvesting tokens typically measure **>= 3.8 bits/byte** (e.g. \`x79a-b49z-corp.xyz\`).
When a hostname exceeds 3.8 bits/byte, Optimus automatically assigns an entropy risk signal.`;
    }

    if (q.includes("homoglyph") || q.includes("typo") || q.includes("brand")) {
      return `### 🔤 Homoglyph & Typosquatting Defense
Attackers replace Latin characters with visually identical Unicode confusables (e.g. Cyrillic 'а' for Latin 'a', or digit '1' for letter 'l' in \`paypa1.com\`).
- Optimus normalizes all hostnames against Unicode confusable tables.
- It calculates the **Levenshtein edit distance** against all protected enterprise brand assets registered in your **Brand Protection** catalog.`;
    }

    // Default intelligent cybersecurity assistant response
    return `### 🤖 Optimus SOC Intelligence Insight
Regarding *"_${query}_"*:

In an enterprise Digital Risk Protection posture, threats are evaluated by correlating structural lexical heuristics with live IoC feeds.

**Recommended Actions:**
1. Submit the specific URL into the **URL & Threat Analyzer** (\`/analyzer\`) for full breakdown.
2. Verify against the **Brand Protection** catalog (\`/brands\`) to ensure your official domains are protected.
3. Review audit logs (\`/audit-logs\`) for recent analyst actions.

Need details on a specific topic? Try asking about **SSRF protection**, **risk scoring**, **database setup**, or **keyboard hotkeys**.`;
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Realistic typing delay
    setTimeout(() => {
      const responseText = generateAnswer(text);
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[460px] rounded-2xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Copilot Header */}
      <div className="p-3.5 border-b border-white/[0.08] bg-gradient-to-r from-cyan-950/50 via-slate-900/50 to-blue-950/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md border border-cyan-400/40">
            <Bot className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
              OPTIMUS AI COPILOT
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-normal">
                Autonomous SOC Agent
              </span>
            </h4>
            <p className="text-[10px] text-cyan-300/70 font-mono">100% Offline Rule Engine &bull; Ready</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                id: "welcome-reset",
                sender: "agent",
                text: "Chat context refreshed. How can I assist your investigation?",
                timestamp: "Just now",
              },
            ])
          }
          className="text-slate-400 hover:text-cyan-300 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
          title="Clear Conversation"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 border ${
                m.sender === "user"
                  ? "bg-blue-600/30 border-blue-400/40 text-blue-300"
                  : "bg-cyan-600/30 border-cyan-400/40 text-cyan-300"
              }`}
            >
              {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3 leading-relaxed relative group ${
                m.sender === "user"
                  ? "bg-blue-950/60 border border-blue-500/30 text-blue-100 rounded-tr-none"
                  : "bg-slate-900/80 border border-cyan-500/20 text-slate-200 rounded-tl-none shadow-md"
              }`}
            >
              <div className="prose prose-invert prose-xs max-w-none text-xs space-y-1.5 break-words">
                {m.text.split("\n\n").map((para, i) => {
                  if (para.startsWith("### ")) {
                    return (
                      <p key={i} className="font-bold text-cyan-300 font-mono text-xs mt-1 mb-1">
                        {para.replace("### ", "")}
                      </p>
                    );
                  }
                  if (para.startsWith("```")) {
                    const code = para.replace(/```[a-z]*\n?/g, "").trim();
                    return (
                      <pre
                        key={i}
                        className="bg-slate-950 p-2.5 rounded-lg border border-white/[0.08] text-[11px] font-mono overflow-x-auto text-cyan-200"
                      >
                        <code>{code}</code>
                      </pre>
                    );
                  }
                  return <p key={i}>{para}</p>;
                })}
              </div>

              <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/[0.05] text-[10px] text-slate-500 font-mono">
                <span>{m.timestamp}</span>
                {m.sender === "agent" && (
                  <button
                    type="button"
                    onClick={() => handleCopy(m.id, m.text)}
                    className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-cyan-600/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="p-3 rounded-2xl rounded-tl-none bg-slate-900/80 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-[11px] animate-pulse">Optimus AI Copilot is analyzing query...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Query Chips */}
      <div className="px-3 py-2 border-t border-white/[0.06] bg-slate-950/40 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0 ml-1 mr-0.5" />
        {PRESET_QUERIES.map((query, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(query)}
            className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-500/20 hover:border-cyan-400 hover:text-cyan-300 text-slate-300 whitespace-nowrap transition-all shrink-0"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-white/[0.08] bg-slate-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI Copilot about SSRF, risk scoring, hotkeys, or DB setup..."
          className="liquid-glass-input flex-1 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 font-mono"
        />
        <Button
          type="submit"
          variant="cyan"
          size="sm"
          disabled={!inputValue.trim() || isTyping}
          className="shadow-liquid-cyan px-3"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
