"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  ShieldCheck,
  AlertTriangle,
  Server,
  KeyRound,
  ExternalLink,
  Activity,
  CheckCircle2,
  Clock,
  Search,
  Zap,
  RefreshCw,
  Database,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileCode,
  ShieldAlert,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import Link from "next/link";

export default function ThreatIntelPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [isSandboxActive, setIsSandboxActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Live Query Console State
  const [targetInput, setTargetInput] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResults, setQueryResults] = useState<any | null>(null);
  const [expandedProviderRaw, setExpandedProviderRaw] = useState<string | null>(null);

  // Health ping state
  const [pingStatus, setPingStatus] = useState<Record<string, { latency: number; status: string; loading?: boolean }>>({});

  // Configure Provider Modal State
  const [configureModalProvider, setConfigureModalProvider] = useState<any | null>(null);
  const [customKeyInput, setCustomKeyInput] = useState("");
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Local IoC Explorer State
  const [isIocModalOpen, setIsIocModalOpen] = useState(false);
  const [iocsList, setIocsList] = useState<any[]>([]);
  const [isLoadingIocs, setIsLoadingIocs] = useState(false);
  const [newIocDomain, setNewIocDomain] = useState("");
  const [newIocType, setNewIocType] = useState("PHISHING_CREDENTIAL_HARVESTER");
  const [newIocDesc, setNewIocDesc] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/threat-intel/status");
      const data = await res.json();
      if (res.ok) {
        setProviders(data.providers || []);
        setIsSandboxActive(Boolean(data.isSandboxActive));
      }
    } catch (err) {
      console.error("Failed to load intel providers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSandbox = async () => {
    const nextState = !isSandboxActive;
    try {
      const res = await fetch("/api/threat-intel/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sandboxMode: nextState }),
      });
      if (res.ok) {
        setIsSandboxActive(nextState);
        await fetchProviders();
      }
    } catch (err) {
      console.error("Failed to toggle sandbox mode:", err);
    }
  };

  const handlePingAdapter = async (providerKey: string) => {
    setPingStatus((prev) => ({
      ...prev,
      [providerKey]: { latency: 0, status: "PINGING...", loading: true },
    }));

    try {
      const res = await fetch("/api/threat-intel/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testProvider: providerKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setPingStatus((prev) => ({
          ...prev,
          [providerKey]: { latency: data.latencyMs, status: "200 OK (HEALTHY)", loading: false },
        }));
      } else {
        setPingStatus((prev) => ({
          ...prev,
          [providerKey]: { latency: 0, status: "ERR", loading: false },
        }));
      }
    } catch {
      setPingStatus((prev) => ({
        ...prev,
        [providerKey]: { latency: 0, status: "ERR", loading: false },
      }));
    }
  };

  const handleRunLiveQuery = async (overrideTarget?: string) => {
    const target = overrideTarget || targetInput;
    if (!target.trim()) return;
    setIsQuerying(true);
    setQueryResults(null);
    setExpandedProviderRaw(null);

    try {
      const res = await fetch("/api/threat-intel/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: target.trim(), forceSandboxSimulation: isSandboxActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setQueryResults(data);
      } else {
        alert(data.error || "Query failed");
      }
    } catch (err: any) {
      alert("Error querying threat feeds: " + err.message);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleFetchIocs = async () => {
    setIsIocModalOpen(true);
    setIsLoadingIocs(true);
    try {
      const res = await fetch("/api/threat-intel/iocs");
      const data = await res.json();
      if (res.ok) {
        setIocsList(data.iocs || []);
      }
    } catch (err) {
      console.error("Failed to fetch IoCs", err);
    } finally {
      setIsLoadingIocs(false);
    }
  };

  const handleAddIoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIocDomain.trim()) return;
    try {
      const res = await fetch("/api/threat-intel/iocs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: newIocDomain.trim(),
          threatType: [newIocType],
          description: newIocDesc.trim() || "Analyst-submitted threat indicator",
        }),
      });
      if (res.ok) {
        setNewIocDomain("");
        setNewIocDesc("");
        const refreshed = await fetch("/api/threat-intel/iocs").then((r) => r.json());
        setIocsList(refreshed.iocs || []);
      }
    } catch (err) {
      console.error("Failed to add IoC:", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Radio className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Threat Intelligence Feeds & Providers
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              AGGREGATOR READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Execute real-time multi-source threat queries, verify feed connectivity, and orchestrate telemetry across defensive feeds.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Cyber Sandbox Mode Switch */}
          <button
            onClick={handleToggleSandbox}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isSandboxActive
                ? "bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                : "bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600"
            }`}
            title="Toggle High-Fidelity Simulation Sandbox for all providers"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isSandboxActive ? "text-cyan-400 animate-spin" : "text-slate-400"}`} />
            <span>Sandbox Mode: {isSandboxActive ? "ACTIVE" : "OFF"}</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleFetchIocs}
            className="text-xs border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300"
          >
            <Database className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
            IoC Database
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchProviders}
            className="text-xs border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Feature 1: Live Multi-Feed Threat Query Console */}
      <Card glow="blue" className="p-5 border-blue-500/30 bg-gradient-to-br from-[#0c1322] via-[#090e1a] to-[#070b14]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Live Multi-Feed Threat Query Console
              </h2>
              <p className="text-[11px] text-slate-400">
                Run an instantaneous threat lookup query across all 4 intelligence feeds simultaneously with real-time latency measurement.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 text-cyan-400 border border-slate-700">
            {providers.filter((p) => p.isConfigured).length}/4 Active Adapters
          </span>
        </div>

        {/* Query Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunLiveQuery()}
              placeholder="Enter URL, domain, or IP (e.g. banking-update-verify.top, paypal-security-alert.xyz, clean-domain.com)..."
              className="w-full rounded-xl border border-slate-700/80 bg-[#070b14] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
            />
          </div>
          <Button
            variant="cyan"
            size="sm"
            onClick={() => handleRunLiveQuery()}
            isLoading={isQuerying}
            className="text-xs font-semibold px-4 whitespace-nowrap shadow-lg shadow-cyan-950/40"
          >
            <Radio className="h-3.5 w-3.5 mr-1.5" />
            Query Feeds
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          <span className="text-slate-500 font-mono text-[10px]">Test Threat Presets:</span>
          {[
            { label: "Banking Trojan Phish", val: "banking-update-verify.top" },
            { label: "PayPal Credential Harvester", val: "paypal-security-alert.xyz" },
            { label: "Cobalt Strike C2 Node", val: "suspicious-c2-node.xyz" },
            { label: "Legitimate Corporate Domain", val: "https://github.com" },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => {
                setTargetInput(preset.val);
                handleRunLiveQuery(preset.val);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 hover:text-cyan-300 text-slate-300 font-mono text-[10px] border border-slate-700/60 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Live Query Results */}
        {queryResults && (
          <div className="mt-5 rounded-xl border border-slate-800 bg-[#070b14]/90 p-4 space-y-4 animate-in fade-in duration-200">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Inspected Host:</span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {queryResults.hostname}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  (Elapsed: {queryResults.totalLatencyMs}ms)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    queryResults.hasConfirmedThreat
                      ? "bg-red-950/80 text-red-400 border border-red-800/60"
                      : "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                  }`}
                >
                  {queryResults.hasConfirmedThreat
                    ? `CONFIRMED THREAT DETECTED (${queryResults.matchesCount} Feeds)`
                    : "NO THREAT MATCHES ACROSS FEEDS"}
                </span>
              </div>
            </div>

            {/* Provider Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {queryResults.results.map((res: any, idx: number) => {
                const isMatch = res.status === "MATCH_FOUND";
                const isNoMatch = res.status === "NO_MATCH";
                const isNotConfig = res.status === "NOT_CONFIGURED";

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3.5 space-y-2.5 transition-all ${
                      isMatch
                        ? "border-red-500/40 bg-red-950/20 shadow-[0_0_12px_rgba(239,68,68,0.1)]"
                        : isNoMatch
                        ? "border-slate-800 bg-[#0c121e]/80"
                        : "border-slate-800/60 bg-[#0c121e]/40 opacity-75"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className={`h-3.5 w-3.5 ${isMatch ? "text-red-400" : "text-cyan-400"}`} />
                        <span className="text-xs font-bold text-white">
                          {res.provider.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {res.latencyMs && (
                          <span className="text-[10px] font-mono text-slate-500">
                            {res.latencyMs}ms
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            isMatch
                              ? "bg-red-900/60 text-red-300 border border-red-700/60"
                              : isNoMatch
                              ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800/40"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {res.matchDetails || res.errorDetails || "No telemetry details available."}
                    </p>

                    {/* Threat types if detected */}
                    {res.threatTypes && res.threatTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {res.threatTypes.map((t: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/60 text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Engine detections for VirusTotal */}
                    {res.engineDetections && res.engineDetections.detected > 0 && (
                      <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800">
                        <span className="text-white font-semibold">Flagged Engines: </span>
                        <span>{res.engineDetections.engines.join(", ")}</span>
                      </div>
                    )}

                    {/* Sandbox metadata for URLScan */}
                    {res.sandboxMetadata && (
                      <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800 space-y-0.5">
                        {res.sandboxMetadata.pageTitle && <div>Title: <span className="text-slate-200">{res.sandboxMetadata.pageTitle}</span></div>}
                        {res.sandboxMetadata.ip && <div>IP: <span className="text-cyan-400">{res.sandboxMetadata.ip}</span></div>}
                        {res.sandboxMetadata.asn && <div>ASN: <span className="text-slate-300">{res.sandboxMetadata.asn}</span></div>}
                      </div>
                    )}

                    {/* Raw response JSON toggle */}
                    {res.rawResponse && (
                      <div className="pt-1 border-t border-slate-800/60">
                        <button
                          onClick={() =>
                            setExpandedProviderRaw(
                              expandedProviderRaw === res.provider ? null : res.provider
                            )
                          }
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <FileCode className="h-3 w-3" />
                          <span>{expandedProviderRaw === res.provider ? "Hide Raw Payload" : "View Raw Payload"}</span>
                          {expandedProviderRaw === res.provider ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </button>
                        {expandedProviderRaw === res.provider && (
                          <pre className="mt-2 p-2 rounded bg-black/60 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-36 border border-slate-800">
                            {JSON.stringify(JSON.parse(res.rawResponse), null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Feature 2: Provider Feeds Operational Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((p) => {
          const ping = pingStatus[p.key];

          return (
            <Card
              key={p.key}
              glow={p.isConfigured ? "blue" : "none"}
              className="space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      p.isConfigured
                        ? "bg-blue-950/60 border-blue-500/30 text-blue-400 shadow-inner"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    <Radio className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400">{p.type}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    p.status.includes("OPERATIONAL")
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {/* Feed Telemetry Details */}
              <div className="space-y-2 rounded-lg bg-[#0c121e] p-3 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Environment Variable:</span>
                  <span className="text-cyan-400">{p.envVar}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Rate Limit:</span>
                  <span className="text-slate-200">{p.rateLimit}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Adapter Mode:</span>
                  <span
                    className={
                      p.isLiveKey
                        ? "text-emerald-400 font-semibold"
                        : p.isSandbox
                        ? "text-cyan-400 font-semibold"
                        : "text-amber-400"
                    }
                  >
                    {p.isLiveKey
                      ? "Live API Active"
                      : p.isSandbox
                      ? "High-Fidelity Cyber Sandbox"
                      : "Fallback Heuristics"}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {p.description ||
                  (p.isConfigured
                    ? "Adapter is actively verifying submitted targets against live feeds with automated timeout protection."
                    : "API key is not configured in .env. Platform automatically relies on local high-confidence IoC rules and offline heuristic inspection.")}
              </p>

              {/* Interactive Adapter Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePingAdapter(p.key)}
                    isLoading={ping?.loading}
                    className="text-xs border-slate-700 hover:bg-slate-800 text-slate-300 py-1 h-auto"
                  >
                    <Activity className="h-3 w-3 mr-1 text-cyan-400" />
                    Test Ping
                  </Button>
                  {ping && !ping.loading && (
                    <span className="text-[10px] font-mono text-emerald-400">
                      {ping.latency}ms ({ping.status})
                    </span>
                  )}
                </div>

                {p.key !== "LOCAL_TEST_FEED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setConfigureModalProvider(p);
                      setCustomKeyInput("");
                    }}
                    className="text-xs text-slate-400 hover:text-cyan-300 py-1 h-auto"
                  >
                    <KeyRound className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Feature 3: Threat Intelligence Integrity & Philosophy */}
      <Card>
        <CardHeader
          title="Threat Intelligence Integrity & Philosophy"
          description="Guidelines for defensive threat telemetry ingestion and multi-engine correlation"
          icon={ShieldCheck}
        />
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            • <strong>Clear Status Separation:</strong> The platform explicitly separates <em>Confirmed Match</em>, <em>No Match</em>, <em>Inconclusive</em>, and <em>Unavailable</em> results.
          </p>
          <p>
            • <strong>Defensive Safeguards:</strong> A negative lookup from a third-party feed is never falsely represented as proof that a suspicious domain is benign.
          </p>
          <p>
            • <strong>SSRF Prevention:</strong> Lookups are performed against provider APIs server-side without resolving or fetching untrusted client URLs.
          </p>
          <p>
            • <strong>High-Fidelity Sandbox Engine:</strong> When external commercial API keys are unavailable, the platform activates a comprehensive heuristic cyber defense engine capable of simulating multi-vendor antivirus scores and DOM sandbox behavior.
          </p>
        </div>
      </Card>

      {/* Modal: Local IoC Database Explorer */}
      <Modal
        isOpen={isIocModalOpen}
        onClose={() => setIsIocModalOpen(false)}
        title="Local High-Confidence Threat Feed Repository"
        description="Inspect and append confirmed Indicators of Compromise (IoCs) to the zero-latency defensive blocklist."
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Add IoC Form */}
          <form onSubmit={handleAddIoc} className="p-3 rounded-xl border border-slate-800 bg-[#070b14] space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-cyan-400" />
              Add Custom IoC Indicator to Feed
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newIocDomain}
                onChange={(e) => setNewIocDomain(e.target.value)}
                placeholder="Domain (e.g. evil-phish-domain.xyz)"
                required
                className="w-full rounded-lg border border-slate-700 bg-[#0c121e] px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono"
              />
              <select
                value={newIocType}
                onChange={(e) => setNewIocType(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0c121e] px-3 py-1.5 text-xs text-white"
              >
                <option value="PHISHING_CREDENTIAL_HARVESTER">Phishing Credential Harvester</option>
                <option value="MALWARE_C2">Malware Command & Control</option>
                <option value="BANKING_TROJAN">Banking Trojan Portal</option>
                <option value="OAUTH_TOKEN_STEALER">OAuth Token Stealer</option>
              </select>
            </div>
            <input
              type="text"
              value={newIocDesc}
              onChange={(e) => setNewIocDesc(e.target.value)}
              placeholder="Description (e.g. Targeted spear-phishing lure targeting executive staff)"
              className="w-full rounded-lg border border-slate-700 bg-[#0c121e] px-3 py-1.5 text-xs text-white placeholder-slate-500"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="cyan" size="sm" className="text-xs">
                Append to Defensive Feed
              </Button>
            </div>
          </form>

          {/* Active IoCs List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300">
              Active In-Memory Threat IoCs ({iocsList.length})
            </h4>
            {iocsList.map((ioc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-800 bg-[#0c121e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-red-400">{ioc.domain}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40">
                      {Array.isArray(ioc.type) ? ioc.type.join(", ") : ioc.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ioc.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">{ioc.firstSeen}</span>
                  <button
                    onClick={() => {
                      setIsIocModalOpen(false);
                      setTargetInput(ioc.domain);
                      handleRunLiveQuery(ioc.domain);
                    }}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    Test Query
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal: Configure Provider */}
      <Modal
        isOpen={Boolean(configureModalProvider)}
        onClose={() => setConfigureModalProvider(null)}
        title={configureModalProvider ? `Configure ${configureModalProvider.name}` : "Configure Provider"}
        description={`Set an API key or activate simulation mode for ${configureModalProvider?.name}.`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Environment Variable:</span>
              <span className="font-mono text-cyan-400">{configureModalProvider?.envVar}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Status:</span>
              <span className="font-mono text-white">{configureModalProvider?.status}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enter API Key
            </label>
            <input
              type="password"
              value={customKeyInput}
              onChange={(e) => setCustomKeyInput(e.target.value)}
              placeholder="Paste provider API key here..."
              className="w-full rounded-lg border border-slate-700 bg-[#0c121e] px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              You can also define this key in your <code>.env</code> file under <code>{configureModalProvider?.envVar}</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-950/20 text-xs text-cyan-300">
            <strong>Sandbox Tip:</strong> If you don&apos;t have a paid or free API key, simply toggle <strong>Sandbox Mode: ACTIVE</strong> at the top of the page to run high-fidelity simulations for all 4 feeds.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfigureModalProvider(null)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="cyan"
              size="sm"
              onClick={() => {
                alert(`Key entered for ${configureModalProvider?.name}. In development, you can save this to .env (${configureModalProvider?.envVar}) or use the Cyber Sandbox toggle.`);
                setConfigureModalProvider(null);
              }}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
