"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Gavel,
  Plus,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Flag,
  ShieldCheck,
  RefreshCw,
  Server,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Info,
  Check,
  ArrowRight,
  Copy,
  Hash,
  Send,
  MessageSquare,
  CornerDownRight,
  Building2,
  Calendar,
  User,
  ArrowLeftRight,
  Trash2,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export type TakedownStage = "Requested" | "Submitted to host" | "Awaiting removal" | "Resolved";

export interface TimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  author: string;
  note?: string;
}

export interface TakedownCase {
  id: string;
  target: string;
  riskScore: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  category: "phishing" | "impersonation" | "malware" | "fraud";
  host: string;
  abuseEmail: string;
  dateOpened: string;
  ownerInitials: string;
  ownerName: string;
  stage: TakedownStage;
  evidenceSummary: string;
  formalNoticeText: string;
  timeline: TimelineEntry[];
  isExample: boolean;
}

const INITIAL_TAKEDOWNS: TakedownCase[] = [
  {
    id: "TKD-2026-8801",
    target: "optlmus-security-verify.net",
    riskScore: 92,
    severity: "CRITICAL",
    category: "phishing",
    host: "NameSilo / FastHost",
    abuseEmail: "abuse@namesilo.com",
    dateOpened: "Oct 10, 2026",
    ownerInitials: "SR",
    ownerName: "Santhosh Reddy",
    stage: "Requested",
    evidenceSummary: "Credential harvest phishing kit masquerading as Optimus CyberDefend platform login with active MX records.",
    formalNoticeText: `URGENT ABUSE & INFRINGEMENT COMPLAINT\nTarget URL: https://optlmus-security-verify.net\nRegistrar: NameSilo LLC\nViolation: Phishing & Malicious Brand Impersonation\nEvidence: Active credential harvest form targeting enterprise users with fraudulent login page. Immediate DNS suspension requested under ICANN Uniform Rapid Suspension (URS).`,
    timeline: [
      {
        id: "tl-1",
        timestamp: "2026-10-10 14:25",
        action: "Case opened via Autonomous Heuristic Core detection",
        author: "SOC-AI Agent",
      },
      {
        id: "tl-2",
        timestamp: "2026-10-10 14:30",
        action: "Evidence package compiled: DOM screenshot, WHOIS record, MX record",
        author: "Analyst (SR)",
      },
    ],
    isExample: true,
  },
  {
    id: "TKD-2026-8798",
    target: "0ptimus-drp-login.xyz",
    riskScore: 86,
    severity: "CRITICAL",
    category: "phishing",
    host: "Porkbun / LeaseWeb",
    abuseEmail: "abuse@porkbun.com",
    dateOpened: "Oct 10, 2026",
    ownerInitials: "AI",
    ownerName: "Optimus Copilot",
    stage: "Submitted to host",
    evidenceSummary: "Typosquatted leet-speak credential harvester hosted on LeaseWeb B.V. Netherlands.",
    formalNoticeText: `FORMAL NOTICE OF FRAUDULENT USE & TRADEMARK INFRINGEMENT\nTarget: 0ptimus-drp-login.xyz\nHost: LeaseWeb B.V.\nSummary: Hostile credential harvesting website impersonating corporate security platform. Cease and desist removal requested immediately.`,
    timeline: [
      {
        id: "tl-3",
        timestamp: "2026-10-10 09:15",
        action: "Case created after brand similarity match",
        author: "SOC-AI Agent",
      },
      {
        id: "tl-4",
        timestamp: "2026-10-10 10:45",
        action: "Automated abuse notice ticket #PB-9941 dispatched to Porkbun Abuse Team",
        author: "Optimus API Dispatcher",
      },
      {
        id: "tl-5",
        timestamp: "2026-10-10 11:20",
        action: "Registrar auto-acknowledged ticket receipt. Queued for Tier-2 legal review.",
        author: "Porkbun Abuse API",
      },
    ],
    isExample: true,
  },
  {
    id: "TKD-2026-8795",
    target: "optimus-token-airdrop.com",
    riskScore: 68,
    severity: "HIGH",
    category: "fraud",
    host: "Dynadot LLC",
    abuseEmail: "abuse@dynadot.com",
    dateOpened: "Oct 08, 2026",
    ownerInitials: "JD",
    ownerName: "Jane Doe (SecOps)",
    stage: "Submitted to host",
    evidenceSummary: "Financial fraud scam soliciting crypto wallet private keys disguised as official platform tokens.",
    formalNoticeText: `FRAUD & FINANCIAL SCAM TAKEDOWN REPORT\nTarget: optimus-token-airdrop.com\nCategory: Financial Fraud / Siphoning\nSummary: Unauthorized usage of corporate brand marks to execute cryptocurrency wallet draining exploits.`,
    timeline: [
      {
        id: "tl-6",
        timestamp: "2026-10-08 17:00",
        action: "Case created following threat intel tip-off",
        author: "Jane Doe",
      },
      {
        id: "tl-7",
        timestamp: "2026-10-08 18:30",
        action: "Formal Cease & Desist transmitted to Dynadot abuse gateway",
        author: "Jane Doe",
      },
    ],
    isExample: true,
  },
  {
    id: "TKD-2026-8791",
    target: "cyberdefend.co.uk.secure-cdn.top",
    riskScore: 64,
    severity: "HIGH",
    category: "impersonation",
    host: "Alibaba Cloud",
    abuseEmail: "abuse@alibabacloud.com",
    dateOpened: "Oct 09, 2026",
    ownerInitials: "SR",
    ownerName: "Santhosh Reddy",
    stage: "Awaiting removal",
    evidenceSummary: "Subdomain nesting attack spoofing official UK corporate domain on malicious .top apex domain.",
    formalNoticeText: `ABUSE ESCALATION - TICKET #ALI-448102\nTarget: cyberdefend.co.uk.secure-cdn.top\nRegistrar: Alibaba Cloud Computing\nStatus: Host confirmed terms of service breach. Upstream transit routing withdrawal pending.`,
    timeline: [
      {
        id: "tl-8",
        timestamp: "2026-10-09 04:00",
        action: "Case opened",
        author: "Analyst (SR)",
      },
      {
        id: "tl-9",
        timestamp: "2026-10-09 06:12",
        action: "Dispatched complaint to Alibaba Cloud Abuse Portal",
        author: "Analyst (SR)",
      },
      {
        id: "tl-10",
        timestamp: "2026-10-09 14:40",
        action: "Registrar confirmed suspension scheduled within 24h window",
        author: "Alibaba Trust & Safety",
      },
    ],
    isExample: true,
  },
  {
    id: "TKD-2026-8784",
    target: "optimus-enterprise-sso.cloud",
    riskScore: 74,
    severity: "HIGH",
    category: "phishing",
    host: "GoDaddy / Hetzner",
    abuseEmail: "abuse@godaddy.com",
    dateOpened: "Oct 07, 2026",
    ownerInitials: "AI",
    ownerName: "Optimus Copilot",
    stage: "Awaiting removal",
    evidenceSummary: "Fake Okta enterprise sign-in portal siphoning employee corporate credentials.",
    formalNoticeText: `CRITICAL WORKFORCE SECURITY BREACH ESCALATION\nTarget: optimus-enterprise-sso.cloud\nHost: GoDaddy.com, LLC\nSummary: Direct copy of enterprise SSO gateway. High urgency takedown mandated.`,
    timeline: [
      {
        id: "tl-11",
        timestamp: "2026-10-07 11:35",
        action: "Case opened and automated evidence compiled",
        author: "SOC-AI Agent",
      },
      {
        id: "tl-12",
        timestamp: "2026-10-07 12:10",
        action: "Dispatched to GoDaddy High-Priority Abuse API",
        author: "Optimus Dispatcher",
      },
    ],
    isExample: true,
  },
  {
    id: "TKD-2026-8760",
    target: "cyberdefend-support-portal.org",
    riskScore: 78,
    severity: "CRITICAL",
    category: "impersonation",
    host: "Namecheap / Cloudflare",
    abuseEmail: "abuse@namecheap.com",
    dateOpened: "Oct 08, 2026",
    ownerInitials: "SR",
    ownerName: "Santhosh Reddy",
    stage: "Resolved",
    evidenceSummary: "Customer support impersonation site. DNS delegation suspended and Cloudflare origin de-peered.",
    formalNoticeText: `RESOLVED: Target suspended by registrar on 2026-10-09. HTTP 404/NXDOMAIN verified across global DNS root servers.`,
    timeline: [
      {
        id: "tl-13",
        timestamp: "2026-10-08 09:14",
        action: "Case created and flagged by Heuristic Core",
        author: "SOC-AI Agent",
      },
      {
        id: "tl-14",
        timestamp: "2026-10-08 10:00",
        action: "Abuse complaint filed to Namecheap Legal & Cloudflare Trust",
        author: "Analyst (SR)",
      },
      {
        id: "tl-15",
        timestamp: "2026-10-09 02:45",
        action: "Namecheap revoked DNS delegation. Domain returned NXDOMAIN.",
        author: "Namecheap Legal",
      },
      {
        id: "tl-16",
        timestamp: "2026-10-09 03:00",
        action: "Case verified resolved and closed by Optimus Autonomous Verifier",
        author: "Optimus Engine",
      },
    ],
    isExample: true,
  },
  {
    id: "TKD-2026-8742",
    target: "optimus-billing-update.info",
    riskScore: 88,
    severity: "CRITICAL",
    category: "fraud",
    host: "Tucows Domains Inc.",
    abuseEmail: "abuse@tucows.com",
    dateOpened: "Oct 05, 2026",
    ownerInitials: "JD",
    ownerName: "Jane Doe (SecOps)",
    stage: "Resolved",
    evidenceSummary: "Payment invoice and credit card skimming portal impersonating accounting department.",
    formalNoticeText: `RESOLVED: Domain suspended and added to Google Safe Browsing / Anti-Phishing blacklists.`,
    timeline: [
      {
        id: "tl-17",
        timestamp: "2026-10-05 08:30",
        action: "Case created and dispatched to Tucows",
        author: "Jane Doe",
      },
      {
        id: "tl-18",
        timestamp: "2026-10-05 13:10",
        action: "Tucows suspended domain registration globally",
        author: "Tucows Compliance",
      },
    ],
    isExample: true,
  },
];

const STAGES: { id: TakedownStage; label: string; accentColor: string; bgAccent: string }[] = [
  {
    id: "Requested",
    label: "Requested",
    accentColor: "text-cyan-400 border-cyan-500/40",
    bgAccent: "bg-cyan-950/30",
  },
  {
    id: "Submitted to host",
    label: "Submitted to host",
    accentColor: "text-amber-400 border-amber-500/40",
    bgAccent: "bg-amber-950/30",
  },
  {
    id: "Awaiting removal",
    label: "Awaiting removal",
    accentColor: "text-purple-400 border-purple-500/40",
    bgAccent: "bg-purple-950/30",
  },
  {
    id: "Resolved",
    label: "Resolved",
    accentColor: "text-emerald-400 border-emerald-500/40",
    bgAccent: "bg-emerald-950/30",
  },
];

export default function TakedownCenterPage() {
  const [cases, setCases] = useState<TakedownCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<TakedownCase | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // New Note State inside side panel
  const [newNoteInput, setNewNoteInput] = useState("");

  // New Takedown Form State
  const [targetInput, setTargetInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<"phishing" | "impersonation" | "malware" | "fraud">("phishing");
  const [hostInput, setHostInput] = useState("Cloudflare / Namecheap");
  const [evidenceInput, setEvidenceInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<"CRITICAL" | "HIGH" | "MEDIUM">("HIGH");
  const [formError, setFormError] = useState<string | null>(null);

  // Load from localStorage or initialize
  useEffect(() => {
    try {
      const saved = localStorage.getItem("optimus_takedowns_db");
      if (saved) {
        setCases(JSON.parse(saved));
      } else {
        setCases(INITIAL_TAKEDOWNS);
        localStorage.setItem("optimus_takedowns_db", JSON.stringify(INITIAL_TAKEDOWNS));
      }
    } catch {
      setCases(INITIAL_TAKEDOWNS);
    }
  }, []);

  const saveCases = (updated: TakedownCase[]) => {
    setCases(updated);
    try {
      localStorage.setItem("optimus_takedowns_db", JSON.stringify(updated));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetSampleCases = () => {
    saveCases(INITIAL_TAKEDOWNS);
    if (selectedCase) setSelectedCase(INITIAL_TAKEDOWNS[0]);
    showToast("Reset to default simulated legal takedown cases.");
  };

  // Top Summary Strip
  const summaryStrip = useMemo(() => {
    const openTakedowns = cases.filter((c) => c.stage !== "Resolved").length;
    const resolvedCount = cases.filter((c) => c.stage === "Resolved").length;
    const total = cases.length;
    const rate = total > 0 ? ((resolvedCount / total) * 100).toFixed(1) : "96.8";

    return {
      openTakedowns,
      medianTimeToRemoval: "3.4 hrs",
      successRate: `${rate}%`,
    };
  }, [cases]);

  // Advance / Change Stage
  const handleUpdateStage = (caseId: string, nextStage: TakedownStage) => {
    const updated = cases.map((c) => {
      if (c.id === caseId) {
        const newTimelineEntry: TimelineEntry = {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          action: `Stage updated from '${c.stage}' to '${nextStage}'`,
          author: "Analyst (Manual Action)",
        };
        return {
          ...c,
          stage: nextStage,
          timeline: [...c.timeline, newTimelineEntry],
        };
      }
      return c;
    });

    saveCases(updated);
    const changed = updated.find((c) => c.id === caseId);
    if (changed) setSelectedCase(changed);
    showToast(`Case moved to stage: ${nextStage}`);
  };

  // Add Note Inside Drawer
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newNoteInput.trim()) return;

    const newEntry: TimelineEntry = {
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      action: "Analyst Case Note Added",
      author: "Santhosh Reddy",
      note: newNoteInput.trim(),
    };

    const updated = cases.map((c) => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          timeline: [...c.timeline, newEntry],
        };
      }
      return c;
    });

    saveCases(updated);
    const changed = updated.find((c) => c.id === selectedCase.id);
    if (changed) setSelectedCase(changed);
    setNewNoteInput("");
    showToast("Note successfully recorded in legal case timeline.");
  };

  // Create New Takedown
  const handleCreateTakedownSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanTarget = targetInput.trim().toLowerCase();
    if (!cleanTarget) {
      setFormError("Target URL or domain name is required.");
      return;
    }

    let calculatedRisk = priorityInput === "CRITICAL" ? 90 : priorityInput === "HIGH" ? 72 : 45;

    const newCase: TakedownCase = {
      id: `TKD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      target: cleanTarget,
      riskScore: calculatedRisk,
      severity: priorityInput,
      category: categoryInput,
      host: hostInput.trim() || "Hosting Provider",
      abuseEmail: `abuse@${cleanTarget.replace(/^www\./, "").split("/")[0]}`,
      dateOpened: "Today",
      ownerInitials: "SR",
      ownerName: "Santhosh Reddy",
      stage: "Requested",
      evidenceSummary: evidenceInput.trim() || `Suspicious brand impersonation targeting Optimus platform assets. Identified via heuristic vector analysis.`,
      formalNoticeText: `LEGAL ENFORCEMENT & REMOVAL REQUEST\nTarget: ${cleanTarget}\nHost: ${hostInput}\nCategory: ${categoryInput.toUpperCase()}\nDetails: Immediate cessation and takedown mandated under applicable acceptable use policy.`,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          action: "Case created and registered for host enforcement",
          author: "Santhosh Reddy",
        },
      ],
      isExample: true,
    };

    const updated = [newCase, ...cases];
    saveCases(updated);

    // Reset Form
    setTargetInput("");
    setEvidenceInput("");
    setIsNewModalOpen(false);
    showToast(`Takedown ticket ${newCase.id} initiated for '${cleanTarget}'`);
  };

  const handleCopyNotice = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
    showToast("Formal legal abuse complaint copied to clipboard!");
  };

  const handleCardClick = (c: TakedownCase) => {
    setSelectedCase(c);
    setIsSidePanelOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0c1a38] border border-cyan-400/40 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl shadow-cyan-900/50 flex items-center gap-3 text-xs font-plex-mono animate-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/40 text-rose-300 text-[11px] font-plex-mono mb-2">
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            <span>ENFORCEMENT DISPATCH &bull; REGISTRAR &amp; CDN ESCALATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-unbounded">
            Takedown Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-plex-sans max-w-2xl">
            Autonomous takedown orchestration, formal abuse packaging, and legal status tracking across Tier-1 hosting providers and registrars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetSampleCases}
            className="text-xs font-plex-mono border-white/10 hover:bg-white/5 text-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reset Sample Cases
          </Button>
          <Button
            variant="cyan"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            className="font-semibold text-xs font-plex-mono shadow-liquid-cyan"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Takedown
          </Button>
        </div>
      </div>

      {/* Example Cases Notice Banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/20 text-xs font-plex-mono text-cyan-300">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>SIMULATED ENFORCEMENT BOARD:</strong> Displaying example active and resolved takedowns. Connected to Heuristic Core abuse dispatcher.
          </span>
        </div>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-cyan-900/50 text-[10px] uppercase font-bold tracking-wider">
          Example Cases Active
        </span>
      </div>

      {/* Small Summary Strip at Top */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Strip 1 */}
        <div className="p-4 rounded-2xl bg-[#0d1a38]/85 border border-white/10 shadow-[6px_8px_20px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-plex-mono uppercase tracking-wider">
              Open Takedowns
            </div>
            <div className="text-2xl font-extrabold text-rose-400 font-unbounded mt-1">
              {summaryStrip.openTakedowns}
            </div>
            <div className="text-[11px] text-slate-400 font-plex-mono mt-0.5">
              Across registrars &amp; CDNs
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Strip 2 */}
        <div className="p-4 rounded-2xl bg-[#0d1a38]/85 border border-white/10 shadow-[6px_8px_20px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-plex-mono uppercase tracking-wider">
              Median Time to Removal
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-unbounded mt-1">
              {summaryStrip.medianTimeToRemoval}
            </div>
            <div className="text-[11px] text-slate-400 font-plex-mono mt-0.5">
              Fastest: 42 mins (Cloudflare)
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Strip 3 */}
        <div className="p-4 rounded-2xl bg-[#0d1a38]/85 border border-white/10 shadow-[6px_8px_20px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-plex-mono uppercase tracking-wider">
              Success Rate This Month
            </div>
            <div className="text-2xl font-extrabold text-cyan-400 font-unbounded mt-1">
              {summaryStrip.successRate}
            </div>
            <div className="text-[11px] text-slate-400 font-plex-mono mt-0.5">
              Legal compliance benchmark
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* KANBAN BOARD CONTAINER (HORIZONTALLY SCROLLABLE ON MOBILE) */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1040px]">
          {STAGES.map((col) => {
            const columnCases = cases.filter((c) => c.stage === col.id);

            return (
              <div
                key={col.id}
                className="flex-1 flex flex-col rounded-2xl bg-[#0a142c]/90 border border-white/10 shadow-xl overflow-hidden min-w-[250px]"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b border-white/10 ${col.bgAccent} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.id === "Resolved" ? "bg-emerald-400" : col.id === "Awaiting removal" ? "bg-purple-400" : col.id === "Submitted to host" ? "bg-amber-400" : "bg-cyan-400"}`} />
                    <h2 className="font-plex-mono font-bold text-xs text-white uppercase tracking-wider">
                      {col.label}
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-xs font-plex-mono text-slate-300 font-semibold border border-white/5">
                    {columnCases.length}
                  </span>
                </div>

                {/* Column Cards Container */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[680px]">
                  {columnCases.length === 0 ? (
                    <div className="py-10 text-center text-slate-500 text-xs font-plex-mono">
                      No tickets currently in {col.label.toLowerCase()}
                    </div>
                  ) : (
                    columnCases.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item)}
                        className="p-4 rounded-xl bg-[#0d1a38] border border-white/10 hover:border-cyan-400/50 cursor-pointer transition-all duration-200 shadow-md hover:shadow-cyan-900/30 group relative"
                      >
                        {/* Card Top: ID & Risk Score */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-plex-mono text-slate-400 font-semibold flex items-center gap-1">
                            <Hash className="w-3 h-3 text-cyan-400" />
                            {item.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-plex-mono font-bold border ${
                              item.riskScore >= 75
                                ? "bg-rose-950/70 text-rose-300 border-rose-500/40"
                                : item.riskScore >= 50
                                ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
                                : "bg-cyan-950/70 text-cyan-300 border-cyan-500/40"
                            }`}
                          >
                            RISK {item.riskScore}
                          </span>
                        </div>

                        {/* Card Target URL */}
                        <h3 className="font-plex-mono font-bold text-xs text-white break-all group-hover:text-cyan-300 transition-colors mb-2">
                          {item.target}
                        </h3>

                        {/* Category & Host Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-plex-mono text-cyan-300 uppercase">
                            {item.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] font-plex-mono text-slate-300 flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5 text-slate-400" />
                            <span className="truncate max-w-[120px]">{item.host}</span>
                          </span>
                        </div>

                        {/* Card Footer: Date & Owner Avatar */}
                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-plex-mono text-slate-400">
                          <span className="flex items-center gap-1 text-[10px]">
                            <Calendar className="w-3 h-3" />
                            {item.dateOpened}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Owner Avatar */}
                            <div
                              title={`Assigned to: ${item.ownerName}`}
                              className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-[9px] flex items-center justify-center border border-white/20 shadow"
                            >
                              {item.ownerInitials}
                            </div>
                          </div>
                        </div>

                        {/* Quick Advance Button */}
                        <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[10px] font-plex-mono text-slate-400">Move stage:</span>
                          <select
                            value={item.stage}
                            onChange={(e) => handleUpdateStage(item.id, e.target.value as TakedownStage)}
                            className="text-[10px] font-plex-mono bg-[#091226] border border-white/10 rounded px-1.5 py-0.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                          >
                            <option value="Requested">Requested</option>
                            <option value="Submitted to host">Submitted to host</option>
                            <option value="Awaiting removal">Awaiting removal</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SIDE PANEL (DRAWER) WHEN CARD IS CLICKED */}
      {isSidePanelOpen && selectedCase && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div
            className="w-full sm:w-[560px] h-full bg-[#081228] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div className="p-6 border-b border-white/10 bg-[#091535] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-plex-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    {selectedCase.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-plex-mono font-bold border ${
                      selectedCase.riskScore >= 75
                        ? "bg-rose-950/70 text-rose-300 border-rose-500/40"
                        : "bg-amber-950/70 text-amber-300 border-amber-500/40"
                    }`}
                  >
                    RISK {selectedCase.riskScore}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white font-plex-mono break-all">
                  {selectedCase.target}
                </h2>
                <p className="text-xs text-slate-400 font-plex-mono mt-0.5">
                  Host: <strong className="text-slate-200">{selectedCase.host}</strong> &bull; Category: <span className="uppercase text-cyan-400">{selectedCase.category}</span>
                </p>
              </div>

              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stage Stepper Selector */}
              <div className="p-4 rounded-xl bg-[#0d1a38] border border-white/10">
                <span className="text-[11px] font-plex-mono uppercase text-slate-400 tracking-wider font-bold block mb-2.5">
                  Current Workflow Stage
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleUpdateStage(selectedCase.id, s.id)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-plex-mono text-center border transition-all ${
                        selectedCase.stage === s.id
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                          : "bg-[#091226] text-slate-400 border-white/10 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence Attached */}
              <div>
                <h3 className="text-xs font-plex-mono uppercase text-slate-400 tracking-wider font-bold mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Evidence Attached &amp; Abuse Telemetry</span>
                  </span>
                  <button
                    onClick={() => handleCopyNotice(selectedCase.formalNoticeText)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-plex-mono lowercase"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedNotice ? "copied!" : "copy notice"}</span>
                  </button>
                </h3>

                <div className="p-4 rounded-xl bg-[#0a1530] border border-white/10 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-plex-mono text-[11px] block mb-0.5">Summary of Threat:</span>
                    <p className="text-white font-plex-sans leading-relaxed">
                      {selectedCase.evidenceSummary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.08]">
                    <span className="text-slate-400 font-plex-mono text-[11px] block mb-1">Host Abuse Channel:</span>
                    <span className="font-plex-mono text-cyan-300 bg-black/40 px-2 py-1 rounded inline-block">
                      {selectedCase.abuseEmail}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/[0.08]">
                    <span className="text-slate-400 font-plex-mono text-[11px] block mb-1">Formal Legal Abuse Notice:</span>
                    <pre className="p-2.5 rounded-lg bg-black/50 text-[11px] font-plex-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-36">
                      {selectedCase.formalNoticeText}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Timeline of Status Changes */}
              <div>
                <h3 className="text-xs font-plex-mono uppercase text-slate-400 tracking-wider font-bold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Timeline of Status Changes ({selectedCase.timeline.length} Events)</span>
                </h3>

                <div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  {selectedCase.timeline.map((entry) => (
                    <div key={entry.id} className="relative text-xs">
                      {/* Timeline Dot */}
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] border-2 border-[#081228]" />
                      <div className="font-plex-mono text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{entry.timestamp}</span>
                        <span>&bull;</span>
                        <span className="text-cyan-300 font-semibold">{entry.author}</span>
                      </div>
                      <p className="text-slate-200 mt-0.5 font-plex-sans">
                        {entry.action}
                      </p>
                      {entry.note && (
                        <div className="mt-1.5 p-2 rounded-lg bg-[#091535] border border-cyan-500/20 text-cyan-200 font-plex-mono text-[11px]">
                          <strong>Note:</strong> {entry.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Note Field (FUNCTIONAL) */}
              <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-[#0d1a38] border border-white/10 space-y-2.5">
                <label className="block text-xs font-plex-mono uppercase text-slate-400 font-bold tracking-wider">
                  Add Analyst Case Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Record host correspondence, ticket ID, or forensic updates..."
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-plex-mono bg-[#091226] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="cyan"
                    size="sm"
                    disabled={!newNoteInput.trim()}
                    className="text-xs font-plex-mono"
                  >
                    <Send className="w-3 h-3 mr-1.5" />
                    Record Note
                  </Button>
                </div>
              </form>
            </div>

            {/* Panel Footer */}
            <div className="p-4 border-t border-white/10 bg-[#070e20] flex items-center justify-between">
              <Button
                variant={selectedCase.stage === "Resolved" ? "outline" : "danger"}
                size="sm"
                onClick={() => handleUpdateStage(selectedCase.id, "Resolved")}
                disabled={selectedCase.stage === "Resolved"}
                className="text-xs font-plex-mono"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                {selectedCase.stage === "Resolved" ? "Already Resolved" : "Mark as Resolved"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidePanelOpen(false)}
                className="text-xs font-plex-mono border-white/10 text-slate-300"
              >
                Close Side Panel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* "NEW TAKEDOWN" MODAL */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setFormError(null);
        }}
        title="Open Legal Takedown Case"
        description="Initiate formal legal escalation, registrar abuse notification, and hosting provider removal tracking."
      >
        <form onSubmit={handleCreateTakedownSubmit} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-plex-mono flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
              Target URL or Domain <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. optlmus-security-verify.net or https://phish.xyz/login"
              value={targetInput}
              onChange={(e) => {
                setTargetInput(e.target.value);
                if (formError) setFormError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091226] border border-white/10 text-white text-xs font-plex-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
                Reason Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#091226] border border-white/10 text-white text-xs font-plex-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="phishing">Phishing</option>
                <option value="impersonation">Brand Impersonation</option>
                <option value="malware">Malware</option>
                <option value="fraud">Financial Fraud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
                Hosting Provider / Registrar
              </label>
              <input
                type="text"
                placeholder="e.g. Cloudflare, Namecheap, AWS"
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#091226] border border-white/10 text-white text-xs font-plex-mono focus:outline-none focus:border-cyan-400"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["CRITICAL", "HIGH", "MEDIUM"] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriorityInput(p)}
                  className={`py-1.5 rounded-lg text-xs font-plex-mono font-bold border transition-colors ${
                    priorityInput === p
                      ? p === "CRITICAL"
                        ? "bg-rose-950 text-rose-300 border-rose-500"
                        : p === "HIGH"
                        ? "bg-amber-950 text-amber-300 border-amber-500"
                        : "bg-cyan-950 text-cyan-300 border-cyan-500"
                      : "bg-[#091226] text-slate-400 border-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
              Supporting Evidence Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe fraudulent behaviors, cloned stylesheets, credential endpoints, or screenshot references..."
              value={evidenceInput}
              onChange={(e) => setEvidenceInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#091226] border border-white/10 text-white text-xs font-plex-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsNewModalOpen(false);
                setFormError(null);
              }}
              className="text-xs font-plex-mono border-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cyan"
              size="sm"
              className="text-xs font-plex-mono font-semibold"
            >
              Generate Case &amp; Dispatch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
