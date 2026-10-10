"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
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
  Gavel,
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
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export interface MonitoredDomain {
  id: string;
  domain: string;
  targetBrand: string;
  riskScore: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "Monitoring" | "Flagged" | "Taken down";
  firstSeen: string;
  lastChecked: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  country: string;
  asn: string;
  aRecords: string[];
  mxRecords: string[];
  nameservers: string[];
  signals: {
    title: string;
    description: string;
    category: string;
    weight: number;
  }[];
  isExample: boolean;
}

const INITIAL_DOMAINS: MonitoredDomain[] = [
  {
    id: "dom-101",
    domain: "optlmus-security-verify.net",
    targetBrand: "Optimus Platform",
    riskScore: 92,
    severity: "CRITICAL",
    status: "Flagged",
    firstSeen: "2026-10-10 14:22",
    lastChecked: "4 mins ago",
    registrar: "NameSilo LLC",
    createdDate: "2026-10-09 (48h ago)",
    expiryDate: "2027-10-09",
    country: "RU (Russian Federation)",
    asn: "AS48291 (FastHost Cloud)",
    aRecords: ["185.220.101.45"],
    mxRecords: ["mail.optlmus-security-verify.net (Priority 10)"],
    nameservers: ["ns1.bulletproof-dns.is", "ns2.bulletproof-dns.is"],
    signals: [
      {
        title: "Combosquat Brand Impersonation",
        description: "Exact brand name combined with deceptive high-trust keywords 'security-verify'",
        category: "BRAND_IMPERSONATION",
        weight: 35,
      },
      {
        title: "Active MX Weaponization",
        description: "Active mail exchangers configured for outbound credential-harvesting phishing campaigns",
        category: "NETWORK_HEURISTIC",
        weight: 30,
      },
      {
        title: "Bulletproof Hosting Infrastructure",
        description: "Resolving to known malicious bulletproof hosting ASN with high abuse ratio",
        category: "HOSTING_RISK",
        weight: 27,
      },
    ],
    isExample: true,
  },
  {
    id: "dom-102",
    domain: "0ptimus-drp-login.xyz",
    targetBrand: "Optimus Platform",
    riskScore: 86,
    severity: "CRITICAL",
    status: "Flagged",
    firstSeen: "2026-10-10 18:05",
    lastChecked: "12 mins ago",
    registrar: "Porkbun LLC",
    createdDate: "2026-10-10 (12h ago)",
    expiryDate: "2027-10-10",
    country: "NL (Netherlands)",
    asn: "AS60781 (LeaseWeb B.V.)",
    aRecords: ["95.211.144.18"],
    mxRecords: ["No MX Records detected"],
    nameservers: ["dns1.porkbun.com", "dns2.porkbun.com"],
    signals: [
      {
        title: "Leet-Speak Numeral Substitution",
        description: "Replaced character 'o' with digit '0' to mimic legitimate portal URL",
        category: "TYPOSQUATTING",
        weight: 38,
      },
      {
        title: "High-Risk Disposable TLD (.xyz)",
        description: "TLD exhibiting >60% correlated malicious staging frequency in threat feeds",
        category: "DOMAIN_STRUCTURE",
        weight: 26,
      },
      {
        title: "Zero Age Registration Spike",
        description: "Domain registered less than 24 hours prior to threat beacon trigger",
        category: "TIME_ANOMALY",
        weight: 22,
      },
    ],
    isExample: true,
  },
  {
    id: "dom-103",
    domain: "cyberdefend-support-portal.org",
    targetBrand: "CyberDefend",
    riskScore: 78,
    severity: "CRITICAL",
    status: "Taken down",
    firstSeen: "2026-10-08 09:14",
    lastChecked: "1 hour ago",
    registrar: "Namecheap, Inc.",
    createdDate: "2026-10-07",
    expiryDate: "2027-10-07",
    country: "US (United States)",
    asn: "AS13335 (Cloudflare)",
    aRecords: ["104.21.55.90", "172.67.180.22"],
    mxRecords: ["mx1.cyberdefend-support-portal.org"],
    nameservers: ["skip.ns.cloudflare.com", "tara.ns.cloudflare.com"],
    signals: [
      {
        title: "Customer Support Impersonation",
        description: "Targeting helpdesk credentials and password reset intercept vectors",
        category: "BRAND_IMPERSONATION",
        weight: 32,
      },
      {
        title: "Cloudflare Reverse-Proxy Masking",
        description: "Hiding origin server behind CDN edge to delay infrastructure discovery",
        category: "CLOAKING",
        weight: 24,
      },
      {
        title: "Takedown Confirmed",
        description: "Host registrar suspended DNS delegation following legal abuse notification",
        category: "ENFORCEMENT",
        weight: 22,
      },
    ],
    isExample: true,
  },
  {
    id: "dom-104",
    domain: "optimus-enterprise-sso.cloud",
    targetBrand: "Optimus Platform",
    riskScore: 68,
    severity: "HIGH",
    status: "Monitoring",
    firstSeen: "2026-10-09 11:30",
    lastChecked: "25 mins ago",
    registrar: "GoDaddy.com, LLC",
    createdDate: "2026-10-05",
    expiryDate: "2027-10-05",
    country: "DE (Germany)",
    asn: "AS24940 (Hetzner Online GmbH)",
    aRecords: ["168.119.82.14"],
    mxRecords: ["mx01.mail.sso.cloud"],
    nameservers: ["ns1.domaincontrol.com", "ns2.domaincontrol.com"],
    signals: [
      {
        title: "SSO Gateway Impersonation",
        description: "Subdomain targeting enterprise Okta / SAML workforce authentication tokens",
        category: "CREDENTIAL_HARVEST",
        weight: 28,
      },
      {
        title: "Levenshtein Distance 0 with Prefix",
        description: "Exact brand name with high-privilege corporate suffix 'enterprise-sso'",
        category: "BRAND_IMPERSONATION",
        weight: 25,
      },
      {
        title: "Foreign Hosting Jurisdiction",
        description: "Server IP geographically diverged from corporate corporate IP registry",
        category: "INFRASTRUCTURE",
        weight: 15,
      },
    ],
    isExample: true,
  },
  {
    id: "dom-105",
    domain: "optimus-token-airdrop.com",
    targetBrand: "Optimus Platform",
    riskScore: 59,
    severity: "HIGH",
    status: "Monitoring",
    firstSeen: "2026-10-07 16:45",
    lastChecked: "42 mins ago",
    registrar: "Dynadot LLC",
    createdDate: "2026-10-03",
    expiryDate: "2027-10-03",
    country: "SC (Seychelles)",
    asn: "AS51852 (PrivateHost Ltd)",
    aRecords: ["193.106.191.88"],
    mxRecords: ["No MX Records detected"],
    nameservers: ["ns1.dynadot.com", "ns2.dynadot.com"],
    signals: [
      {
        title: "Cryptocurrency / Web3 Scams Bait",
        description: "Using false token giveaways or airdrops to siphon web wallets",
        category: "FINANCIAL_FRAUD",
        weight: 30,
      },
      {
        title: "Offshore Offshore Registrar Privacy",
        description: "Masked ownership with privacy service located in offshore jurisdiction",
        category: "REGISTRATION_ANOMALY",
        weight: 29,
      },
    ],
    isExample: true,
  },
  {
    id: "dom-106",
    domain: "cyberdefend.co.uk.secure-cdn.top",
    targetBrand: "CyberDefend",
    riskScore: 64,
    severity: "HIGH",
    status: "Flagged",
    firstSeen: "2026-10-10 02:18",
    lastChecked: "1 hour ago",
    registrar: "Alibaba Cloud Computing Ltd",
    createdDate: "2026-10-08",
    expiryDate: "2027-10-08",
    country: "SG (Singapore)",
    asn: "AS45102 (Alibaba US)",
    aRecords: ["47.254.120.31"],
    mxRecords: ["No MX Records detected"],
    nameservers: ["dns10.hichina.com", "dns9.hichina.com"],
    signals: [
      {
        title: "Subdomain Deep-Nesting Spoof",
        description: "Placing legitimate domain name as third-level subdomain inside malicious root",
        category: "URL_ANOMALY",
        weight: 32,
      },
      {
        title: "Suspicious Root TLD (.top)",
        description: "Root domain under .top TLD commonly associated with bulk malicious campaigns",
        category: "DOMAIN_STRUCTURE",
        weight: 32,
      },
    ],
    isExample: true,
  },
  {
    id: "dom-107",
    domain: "optlmus.io",
    targetBrand: "Optimus Platform",
    riskScore: 48,
    severity: "MEDIUM",
    status: "Monitoring",
    firstSeen: "2026-09-28 20:10",
    lastChecked: "3 hours ago",
    registrar: "Gandi SAS",
    createdDate: "2026-09-20",
    expiryDate: "2027-09-20",
    country: "FR (France)",
    asn: "AS29241 (Gandi Hosting)",
    aRecords: ["217.70.184.38"],
    mxRecords: ["No MX Records detected"],
    nameservers: ["a.dns.gandi.net", "b.dns.gandi.net"],
    signals: [
      {
        title: "Typo: Single Character Swap ('i' -> 'l')",
        description: "Subtle character substitution easily overlooked in mobile browser address bars",
        category: "TYPOSQUATTING",
        weight: 26,
      },
      {
        title: "Parked Parking Page Template",
        description: "Resolves to registrar default landing page without active phishing payload yet",
        category: "DORMANT_STAGING",
        weight: 22,
      },
    ],
    isExample: true,
  },
  {
    id: "dom-108",
    domain: "optimus-docs.dev",
    targetBrand: "Optimus Platform",
    riskScore: 22,
    severity: "LOW",
    status: "Monitoring",
    firstSeen: "2026-09-15 12:00",
    lastChecked: "5 hours ago",
    registrar: "Google LLC",
    createdDate: "2026-08-10",
    expiryDate: "2027-08-10",
    country: "US (United States)",
    asn: "AS15169 (Google LLC)",
    aRecords: ["199.36.158.100"],
    mxRecords: ["aspmx.l.google.com"],
    nameservers: ["ns-cloud-a1.googledomains.com"],
    signals: [
      {
        title: "Developer Community Documentation",
        description: "Open-source developer API documentation mirror. Low threat heuristic score.",
        category: "LEGITIMATE_MIRROR",
        weight: 22,
      },
    ],
    isExample: true,
  },
  {
    id: "dom-109",
    domain: "optimus-careers-global.com",
    targetBrand: "Optimus Platform",
    riskScore: 15,
    severity: "LOW",
    status: "Monitoring",
    firstSeen: "2026-08-22 10:00",
    lastChecked: "6 hours ago",
    registrar: "MarkMonitor Inc.",
    createdDate: "2026-07-12",
    expiryDate: "2027-07-12",
    country: "US (United States)",
    asn: "AS16509 (Amazon.com)",
    aRecords: ["52.216.14.99"],
    mxRecords: ["mail.optimus-careers-global.com"],
    nameservers: ["ns1.markmonitor.com", "ns2.markmonitor.com"],
    signals: [
      {
        title: "Verified Internal Corporate Asset",
        description: "Registered by enterprise corporate registrar MarkMonitor. Verified safe.",
        category: "INTERNAL_AUTHORIZED",
        weight: 15,
      },
    ],
    isExample: true,
  },
];

export default function DomainMonitoringPage() {
  const [domains, setDomains] = useState<MonitoredDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<MonitoredDomain | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Domain Form State
  const [newDomainInput, setNewDomainInput] = useState("");
  const [newBrandInput, setNewBrandInput] = useState("Optimus Platform");
  const [newCategoryInput, setNewCategoryInput] = useState("Phishing lookalike");
  const [newNotesInput, setNewNotesInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage or initial
  useEffect(() => {
    try {
      const saved = localStorage.getItem("optimus_monitored_domains");
      if (saved) {
        setDomains(JSON.parse(saved));
      } else {
        setDomains(INITIAL_DOMAINS);
        localStorage.setItem("optimus_monitored_domains", JSON.stringify(INITIAL_DOMAINS));
      }
    } catch {
      setDomains(INITIAL_DOMAINS);
    }
  }, []);

  const saveDomains = (updated: MonitoredDomain[]) => {
    setDomains(updated);
    try {
      localStorage.setItem("optimus_monitored_domains", JSON.stringify(updated));
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset to original demo data
  const handleResetDemoData = () => {
    saveDomains(INITIAL_DOMAINS);
    if (selectedDomain) {
      setSelectedDomain(INITIAL_DOMAINS[0]);
    }
    showToast("Reset to default simulated domain intelligence dataset.");
  };

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = domains.length;
    const lookalikesToday = domains.filter((d) => d.riskScore >= 70).length;
    const activeTakedowns = domains.filter((d) => d.status === "Flagged").length;
    const takenDown = domains.filter((d) => d.status === "Taken down").length;

    return {
      total,
      lookalikesToday,
      activeTakedowns,
      takenDown,
      avgDetectionTime: "4.2 min",
    };
  }, [domains]);

  // Filtered Domains
  const filteredDomains = useMemo(() => {
    return domains.filter((item) => {
      // Status filter
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }
      // Risk filter
      if (riskFilter !== "ALL") {
        if (riskFilter === "CRITICAL" && item.riskScore < 75) return false;
        if (riskFilter === "HIGH" && (item.riskScore < 50 || item.riskScore >= 75)) return false;
        if (riskFilter === "MEDIUM" && (item.riskScore < 25 || item.riskScore >= 50)) return false;
        if (riskFilter === "LOW" && item.riskScore >= 25) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDomain = item.domain.toLowerCase().includes(q);
        const matchesBrand = item.targetBrand.toLowerCase().includes(q);
        const matchesRegistrar = item.registrar.toLowerCase().includes(q);
        if (!matchesDomain && !matchesBrand && !matchesRegistrar) return false;
      }
      return true;
    });
  }, [domains, statusFilter, riskFilter, searchQuery]);

  // Domain Validation Regex
  const validateDomain = (val: string): boolean => {
    const cleaned = val.trim().toLowerCase();
    // No http/https or path slashes
    if (cleaned.startsWith("http://") || cleaned.startsWith("https://") || cleaned.includes("/")) {
      return false;
    }
    const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return regex.test(cleaned);
  };

  // Add Domain Submission
  const handleAddDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanDomain = newDomainInput.trim().toLowerCase();

    if (!cleanDomain) {
      setFormError("Domain name is required.");
      return;
    }

    if (!validateDomain(cleanDomain)) {
      setFormError("Invalid domain format. Enter a valid FQDN (e.g., 'secure-optimus-login.com') without http:// or trailing slashes.");
      return;
    }

    if (domains.some((d) => d.domain.toLowerCase() === cleanDomain)) {
      setFormError("This domain is already actively monitored in your threat register.");
      return;
    }

    // Heuristic Score Generation based on lexical attributes
    let calculatedScore = 55;
    if (cleanDomain.includes("login") || cleanDomain.includes("verify") || cleanDomain.includes("auth") || cleanDomain.includes("sso")) {
      calculatedScore += 25;
    }
    if (cleanDomain.endsWith(".xyz") || cleanDomain.endsWith(".top") || cleanDomain.endsWith(".live") || cleanDomain.endsWith(".click")) {
      calculatedScore += 15;
    }
    if (cleanDomain.includes("-") || cleanDomain.length > 22) {
      calculatedScore += 10;
    }
    calculatedScore = Math.min(98, Math.max(18, calculatedScore));

    let sev: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "LOW";
    if (calculatedScore >= 75) sev = "CRITICAL";
    else if (calculatedScore >= 50) sev = "HIGH";
    else if (calculatedScore >= 25) sev = "MEDIUM";

    const newEntry: MonitoredDomain = {
      id: `dom-${Date.now().toString().slice(-4)}`,
      domain: cleanDomain,
      targetBrand: newBrandInput,
      riskScore: calculatedScore,
      severity: sev,
      status: calculatedScore >= 75 ? "Flagged" : "Monitoring",
      firstSeen: new Date().toISOString().replace("T", " ").slice(0, 16),
      lastChecked: "Just now",
      registrar: "Cloudflare Registrar / Namecheap",
      createdDate: "Just now (Live Detection)",
      expiryDate: "2027-10-11",
      country: "US (Cloudflare Anycast)",
      asn: "AS13335 (Cloudflare)",
      aRecords: ["104.21.32.112", "172.67.140.85"],
      mxRecords: ["mx01.mailgun.org (Priority 10)"],
      nameservers: ["eva.ns.cloudflare.com", "max.ns.cloudflare.com"],
      signals: [
        {
          title: `Autonomous Perimeter Detection: ${newCategoryInput}`,
          description: newNotesInput || `Lexical permutation flagged by Heuristic Core targeting brand '${newBrandInput}'`,
          category: "LEXICAL_ANALYSIS",
          weight: Math.round(calculatedScore * 0.4),
        },
        {
          title: "SSRF-Safe In-Memory Lexical Inspection",
          description: "Analysis conducted with 0 outbound HTTP fetches to prevent reconnaissance leaks",
          category: "DEFENSIVE_CONTROL",
          weight: Math.round(calculatedScore * 0.35),
        },
        {
          title: "Certificate Transparency Feed Match",
          description: "Pre-issuance CT log telemetry intercepted before threat staging completed",
          category: "CT_MONITOR",
          weight: Math.round(calculatedScore * 0.25),
        },
      ],
      isExample: true,
    };

    const updated = [newEntry, ...domains];
    saveDomains(updated);

    // Reset Form
    setNewDomainInput("");
    setNewNotesInput("");
    setIsAddModalOpen(false);
    showToast(`Domain '${cleanDomain}' added to monitoring registry (Risk: ${calculatedScore}/100)`);
  };

  // Actions from Drawer & Menu
  const handleToggleFlag = (domainId: string) => {
    const updated = domains.map((d) => {
      if (d.id === domainId) {
        const nextStatus = d.status === "Flagged" ? "Monitoring" : "Flagged";
        return { ...d, status: nextStatus as any };
      }
      return d;
    });
    saveDomains(updated);

    const changed = updated.find((d) => d.id === domainId);
    if (changed) {
      setSelectedDomain(changed);
      showToast(
        changed.status === "Flagged"
          ? `Flagged ${changed.domain} for priority SOC escalation`
          : `Removed flag from ${changed.domain} — status set to Monitoring`
      );
    }
  };

  const handleStartTakedown = (domainItem: MonitoredDomain) => {
    // 1. Update domain status to Flagged
    const updated = domains.map((d) => {
      if (d.id === domainItem.id) {
        return { ...d, status: "Flagged" as const };
      }
      return d;
    });
    saveDomains(updated);

    // 2. Add to takedowns localStorage if available
    try {
      const existingTakedowns = JSON.parse(localStorage.getItem("optimus_takedowns_db") || "[]");
      const newTakedown = {
        id: `TKD-${Date.now().toString().slice(-4)}`,
        target: domainItem.domain,
        riskScore: domainItem.riskScore,
        category: "Phishing & Impersonation",
        host: domainItem.registrar.split(" ")[0] || "Hosting Provider",
        dateOpened: "Today",
        owner: "SR",
        ownerName: "Santhosh Reddy",
        stage: "Requested",
        evidence: `Automated detection triggered by OPTIMUS Heuristic Core against ${domainItem.targetBrand}. Levenshtein distance 1, active MX records.`,
        timeline: [
          {
            timestamp: "Just now",
            action: "Takedown requested via Domain Monitoring console",
            author: "Analyst",
          },
        ],
        notes: `Initial triage confirmed active brand spoofing. Escalated from Domain Monitoring table.`,
      };
      localStorage.setItem("optimus_takedowns_db", JSON.stringify([newTakedown, ...existingTakedowns]));
    } catch {}

    const changed = updated.find((d) => d.id === domainItem.id);
    if (changed) setSelectedDomain(changed);
    showToast(`Takedown ticket generated for ${domainItem.domain}! Dispatched to Takedown Center.`);
  };

  const handleDismiss = (domainId: string) => {
    const updated = domains.map((d) => {
      if (d.id === domainId) {
        return { ...d, status: "Monitoring" as const };
      }
      return d;
    });
    saveDomains(updated);
    const changed = updated.find((d) => d.id === domainId);
    if (changed) setSelectedDomain(changed);
    showToast(`Alert dismissed. Domain returned to standard baseline monitoring.`);
  };

  const handleRowClick = (item: MonitoredDomain) => {
    setSelectedDomain(item);
    setIsDetailOpen(true);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-[11px] font-plex-mono mb-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>PERIMETER HEURISTIC RADAR &bull; CONTINUOUS RECONNAISSANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-unbounded">
            Domain Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-plex-sans max-w-2xl">
            Autonomous reconnaissance hunting combosquats, homoglyphs, and unauthorized lookalike domains before weaponisation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDemoData}
            className="text-xs font-plex-mono border-white/10 hover:bg-white/5 text-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reset Demo Data
          </Button>
          <Button
            variant="cyan"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="font-semibold text-xs font-plex-mono shadow-liquid-cyan"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Domain
          </Button>
        </div>
      </div>

      {/* Example Data Banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/20 text-xs font-plex-mono text-cyan-300">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>SIMULATED INTEL FEED:</strong> Displaying example lookalike datasets. Real-time WHOIS, RDAP &amp; Certificate Transparency (CT) log streams actively simulated.
          </span>
        </div>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-cyan-900/50 text-[10px] uppercase font-bold tracking-wider">
          Example Telemetry Active
        </span>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1a38]/85 border border-white/10 shadow-[6px_8px_20px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-plex-mono">
            <span>DOMAINS MONITORED</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-unbounded mt-2">
            {summaryMetrics.total}
          </div>
          <div className="text-[11px] text-cyan-400/80 font-plex-mono mt-1 flex items-center gap-1">
            <span className="text-emerald-400">+{domains.length - INITIAL_DOMAINS.length >= 0 ? `+${domains.length}` : domains.length}</span>
            <span>across registered brands</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1a38]/85 border border-white/10 shadow-[6px_8px_20px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-plex-mono">
            <span>CRITICAL LOOKALIKES</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-unbounded mt-2">
            {summaryMetrics.lookalikesToday}
          </div>
          <div className="text-[11px] text-slate-400 font-plex-mono mt-1">
            <span className="text-amber-400">Risk &ge; 70</span> requiring analyst review
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1a38]/85 border border-white/10 shadow-[6px_8px_20px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-plex-mono">
            <span>ACTIVE TAKEDOWNS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-unbounded mt-2">
            {summaryMetrics.activeTakedowns}
          </div>
          <div className="text-[11px] text-slate-400 font-plex-mono mt-1 flex items-center gap-1">
            <span className="text-emerald-400">{summaryMetrics.takenDown} resolved</span>
            <span>this month</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1a38]/85 border border-white/10 shadow-[6px_8px_20px_rgba(2,6,18,0.7),inset_1px_1px_2px_rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-plex-mono">
            <span>AVG DETECTION TIME</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-unbounded mt-2">
            {summaryMetrics.avgDetectionTime}
          </div>
          <div className="text-[11px] text-slate-400 font-plex-mono mt-1">
            <span className="text-emerald-400">-18% faster</span> via lexical triage
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 border-white/10 bg-[#0d1a38]/90 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by domain name, brand, or registrar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-plex-mono bg-[#091226] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs font-plex-mono text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#091226] border border-white/10 text-slate-200 text-xs font-plex-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Statuses</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Flagged">Flagged</option>
                <option value="Taken down">Taken down</option>
              </select>
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-1.5 text-xs font-plex-mono text-slate-400">
              <span>Risk:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-[#091226] border border-white/10 text-slate-200 text-xs font-plex-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical (&gt; 75)</option>
                <option value="HIGH">High (50 - 74)</option>
                <option value="MEDIUM">Medium (25 - 49)</option>
                <option value="LOW">Low (&lt; 25)</option>
              </select>
            </div>

            {(statusFilter !== "ALL" || riskFilter !== "ALL" || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("ALL");
                  setRiskFilter("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-plex-mono text-cyan-400 hover:text-cyan-300 p-1.5"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Domain Monitoring Table */}
      <Card className="border-white/10 bg-[#0d1a38]/90 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left text-xs font-plex-sans border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#081124] text-slate-400 font-plex-mono text-[11px] tracking-wider uppercase">
                <th className="py-3.5 px-4">Monitored Domain</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 hidden md:table-cell">First Seen</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Last Checked</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredDomains.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-plex-mono">
                    <Globe className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-semibold">No monitored domains match the active criteria.</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting search filters or click 'Add Domain' above.</p>
                  </td>
                </tr>
              ) : (
                filteredDomains.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="hover:bg-white/[0.04] cursor-pointer transition-colors group"
                  >
                    {/* Domain Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#081228] border border-white/10 flex items-center justify-center shrink-0 text-cyan-400 group-hover:border-cyan-400/50 transition-colors">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-plex-mono font-semibold text-white flex items-center gap-2">
                            <span>{item.domain}</span>
                            {item.isExample && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-plex-mono text-slate-400 border border-slate-700">
                                EXAMPLE
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-plex-mono">
                            <span className="text-cyan-400/90">{item.targetBrand}</span>
                            <span>&bull;</span>
                            <span className="truncate max-w-[140px]">{item.registrar}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`font-plex-mono font-bold text-sm ${
                            item.riskScore >= 75
                              ? "text-rose-400"
                              : item.riskScore >= 50
                              ? "text-amber-400"
                              : item.riskScore >= 25
                              ? "text-yellow-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {item.riskScore}
                        </div>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              item.riskScore >= 75
                                ? "bg-rose-500"
                                : item.riskScore >= 50
                                ? "bg-amber-500"
                                : item.riskScore >= 25
                                ? "bg-yellow-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${item.riskScore}%` }}
                          />
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-plex-mono font-bold border ${
                            item.riskScore >= 75
                              ? "bg-rose-950/70 text-rose-300 border-rose-500/40"
                              : item.riskScore >= 50
                              ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
                              : item.riskScore >= 25
                              ? "bg-yellow-950/70 text-yellow-300 border-yellow-500/40"
                              : "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-plex-mono font-medium border ${
                          item.status === "Flagged"
                            ? "bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
                            : item.status === "Taken down"
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                            : "bg-cyan-950/60 text-cyan-300 border-cyan-500/40"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Flagged"
                              ? "bg-rose-400 animate-pulse"
                              : item.status === "Taken down"
                              ? "bg-emerald-400"
                              : "bg-cyan-400"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>

                    {/* First Seen */}
                    <td className="py-3.5 px-4 hidden md:table-cell font-plex-mono text-slate-300 text-[11px]">
                      {item.firstSeen}
                    </td>

                    {/* Last Checked */}
                    <td className="py-3.5 px-4 hidden sm:table-cell font-plex-mono text-slate-400 text-[11px]">
                      {item.lastChecked}
                    </td>

                    {/* Action Menu Buttons */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRowClick(item)}
                          className="h-7 px-2 text-xs font-plex-mono text-slate-300 hover:text-white hover:bg-white/10"
                        >
                          Details
                        </Button>

                        <button
                          title={item.status === "Flagged" ? "Clear Flag" : "Flag Domain"}
                          onClick={() => handleToggleFlag(item.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            item.status === "Flagged"
                              ? "bg-rose-950/60 text-rose-400 border-rose-500/40 hover:bg-rose-900/60"
                              : "bg-[#091226] text-slate-400 border-white/10 hover:text-amber-400 hover:border-amber-400/40"
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>

                        <button
                          title="Start Legal Takedown"
                          onClick={() => handleStartTakedown(item)}
                          className="p-1.5 rounded-lg bg-[#091226] text-slate-400 border border-white/10 hover:text-rose-400 hover:border-rose-400/40 transition-colors"
                        >
                          <Gavel className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DETAIL DRAWER (SLIDE-OVER FROM RIGHT) */}
      {isDetailOpen && selectedDomain && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div
            className="w-full sm:w-[540px] h-full bg-[#081228] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 bg-[#091535] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-plex-mono font-bold border ${
                      selectedDomain.riskScore >= 75
                        ? "bg-rose-950/70 text-rose-300 border-rose-500/40"
                        : selectedDomain.riskScore >= 50
                        ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
                        : "bg-cyan-950/70 text-cyan-300 border-cyan-500/40"
                    }`}
                  >
                    SCORE: {selectedDomain.riskScore}/100 &bull; {selectedDomain.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-plex-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    {selectedDomain.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white font-plex-mono break-all flex items-center gap-2">
                  <span>{selectedDomain.domain}</span>
                </h2>
                <p className="text-xs text-slate-400 font-plex-mono mt-0.5">
                  Target: <strong className="text-cyan-400">{selectedDomain.targetBrand}</strong> &bull; First Seen: {selectedDomain.firstSeen}
                </p>
              </div>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Interactive Action Control Panel */}
              <div className="p-4 rounded-xl bg-[#0d1c3e] border border-cyan-500/30 shadow-lg">
                <span className="text-[11px] font-plex-mono uppercase text-cyan-300 tracking-wider font-semibold block mb-2.5">
                  SOC Triage Operations
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedDomain.status === "Flagged" ? "danger" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFlag(selectedDomain.id)}
                    className="text-xs font-plex-mono"
                  >
                    <Flag className="w-3.5 h-3.5 mr-1" />
                    {selectedDomain.status === "Flagged" ? "Unflag" : "Flag"}
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStartTakedown(selectedDomain)}
                    className="text-xs font-plex-mono"
                  >
                    <Gavel className="w-3.5 h-3.5 mr-1" />
                    Takedown
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDismiss(selectedDomain.id)}
                    className="text-xs font-plex-mono border-white/10 text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Dismiss
                  </Button>
                </div>
              </div>

              {/* Signals behind the score */}
              <div>
                <h3 className="text-xs font-plex-mono uppercase text-slate-400 tracking-wider font-bold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Signals Behind Risk Score ({selectedDomain.signals.length} Identified)</span>
                </h3>

                <div className="space-y-2.5">
                  {selectedDomain.signals.map((sig, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0a1530] border border-white/10 text-xs"
                    >
                      <div className="flex items-center justify-between font-plex-mono font-semibold text-white mb-1">
                        <span className="flex items-center gap-1.5 text-slate-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{sig.title}</span>
                        </span>
                        <span className="text-rose-400 font-plex-mono font-bold text-[11px]">
                          +{sig.weight} pts
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed pl-5 font-plex-sans">
                        {sig.description}
                      </p>
                      <div className="pl-5 mt-1.5">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-plex-mono text-cyan-300">
                          {sig.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DNS & Registration Telemetry */}
              <div>
                <h3 className="text-xs font-plex-mono uppercase text-slate-400 tracking-wider font-bold mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>DNS &amp; Registration Telemetry</span>
                </h3>

                <div className="rounded-xl bg-[#0a1530] border border-white/10 divide-y divide-white/[0.08] text-xs font-plex-mono">
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-slate-400">Registrar</span>
                    <span className="text-white font-medium">{selectedDomain.registrar}</span>
                  </div>

                  <div className="p-3 flex justify-between items-center">
                    <span className="text-slate-400">Creation Date</span>
                    <span className="text-white">{selectedDomain.createdDate}</span>
                  </div>

                  <div className="p-3 flex justify-between items-center">
                    <span className="text-slate-400">Expiration</span>
                    <span className="text-white">{selectedDomain.expiryDate}</span>
                  </div>

                  <div className="p-3 flex justify-between items-center">
                    <span className="text-slate-400">Hosting ASN &amp; Geo</span>
                    <span className="text-cyan-300 text-right">{selectedDomain.country} &bull; {selectedDomain.asn}</span>
                  </div>

                  <div className="p-3">
                    <span className="text-slate-400 block mb-1">A Records (IPs)</span>
                    <div className="space-y-1">
                      {selectedDomain.aRecords.map((ip, i) => (
                        <div key={i} className="text-white font-mono bg-black/30 px-2 py-1 rounded">
                          {ip}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3">
                    <span className="text-slate-400 block mb-1">MX Records (Mail Server)</span>
                    <div className="space-y-1">
                      {selectedDomain.mxRecords.map((mx, i) => (
                        <div key={i} className="text-white font-mono bg-black/30 px-2 py-1 rounded">
                          {mx}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3">
                    <span className="text-slate-400 block mb-1">Authoritative Nameservers</span>
                    <div className="space-y-1">
                      {selectedDomain.nameservers.map((ns, i) => (
                        <div key={i} className="text-slate-300 font-mono bg-black/30 px-2 py-1 rounded text-[11px]">
                          {ns}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-white/10 bg-[#070e20] flex items-center justify-between">
              <Link
                href="/takedowns"
                className="inline-flex items-center gap-1.5 text-xs font-plex-mono text-cyan-400 hover:text-cyan-300"
              >
                <span>Jump to Takedown Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailOpen(false)}
                className="text-xs font-plex-mono border-white/10 text-slate-300"
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* "ADD DOMAIN" MODAL WITH REAL VALIDATION */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormError(null);
        }}
        title="Add Domain to Perimeter Monitoring"
        description="Register a new domain or suspicious lookalike to start autonomous WHOIS, DNS, and heuristic threat surveillance."
      >
        <form onSubmit={handleAddDomainSubmit} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-plex-mono flex items-start gap-2 animate-in fade-in duration-150">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
              Domain Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. optimus-security-login.xyz"
              value={newDomainInput}
              onChange={(e) => {
                setNewDomainInput(e.target.value);
                if (formError) setFormError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091226] border border-white/10 text-white text-xs font-plex-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            <p className="text-[11px] text-slate-400 font-plex-mono mt-1">
              Valid FQDN required. Do not include http://, https://, or URL path parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
                Associated Brand
              </label>
              <select
                value={newBrandInput}
                onChange={(e) => setNewBrandInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#091226] border border-white/10 text-white text-xs font-plex-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="Optimus Platform">Optimus Platform</option>
                <option value="CyberDefend">CyberDefend</option>
                <option value="Executive VIP Shield">Executive VIP Shield</option>
                <option value="Corporate Portal">Corporate Portal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
                Threat Classification
              </label>
              <select
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#091226] border border-white/10 text-white text-xs font-plex-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="Phishing lookalike">Phishing lookalike</option>
                <option value="Combosquatting / Typosquat">Combosquatting / Typosquat</option>
                <option value="Active MX weaponization">Active MX weaponization</option>
                <option value="Brand Impersonation">Brand Impersonation</option>
                <option value="Corporate Authorized Asset">Corporate Authorized Asset</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-plex-mono text-slate-300 mb-1 font-semibold">
              Analyst Notes / Context (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Intercepted from CT log alert; suspicious mail exchanger configured."
              value={newNotesInput}
              onChange={(e) => setNewNotesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#091226] border border-white/10 text-white text-xs font-plex-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
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
              Register &amp; Start Surveillance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
