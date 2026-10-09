"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Trash2,
  Globe,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Search,
  Zap,
  Fingerprint,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Eye,
  Sliders,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import Link from "next/link";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New brand state
  const [brandName, setBrandName] = useState("");
  const [officialDomain, setOfficialDomain] = useState("");
  const [aliases, setAliases] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Domain Tester State
  const [testDomainInput, setTestDomainInput] = useState("");
  const [isTestingDomain, setIsTestingDomain] = useState(false);
  const [domainTestResult, setDomainTestResult] = useState<any | null>(null);

  // Permutation Inspector Modal State
  const [selectedBrandForPermutations, setSelectedBrandForPermutations] = useState<any | null>(null);
  const [isPermutationModalOpen, setIsPermutationModalOpen] = useState(false);
  const [isLoadingPermutations, setIsLoadingPermutations] = useState(false);
  const [permutationData, setPermutationData] = useState<{
    permutations: any[];
    relatedFindings: any[];
    totalPermutations: number;
  } | null>(null);
  const [permutationFilter, setPermutationFilter] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();
      if (res.ok) setBrands(data.brands || []);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const aliasArray = aliases
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          officialDomain: officialDomain.trim(),
          aliases: aliasArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register brand");

      setBrandName("");
      setOfficialDomain("");
      setAliases("");
      setIsModalOpen(false);
      await fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (brand: any) => {
    try {
      const res = await fetch(`/api/brands/${brand.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !brand.isActive }),
      });
      if (res.ok) {
        setBrands((prev) =>
          prev.map((b) => (b.id === brand.id ? { ...b, isActive: !b.isActive } : b))
        );
      }
    } catch (err) {
      console.error("Failed to toggle brand status", err);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from protected brand monitoring?`)) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      await fetchBrands();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Run live imposter domain test
  const handleRunDomainTest = async (overrideTarget?: string) => {
    const target = overrideTarget || testDomainInput;
    if (!target.trim()) return;
    setIsTestingDomain(true);
    setDomainTestResult(null);

    try {
      const res = await fetch("/api/brands/test-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDomain: target.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setDomainTestResult(data);
      } else {
        alert(data.error || "Domain test failed");
      }
    } catch (err: any) {
      alert("Error evaluating domain: " + err.message);
    } finally {
      setIsTestingDomain(false);
    }
  };

  // Open Permutation Inspector
  const handleOpenPermutations = async (brand: any) => {
    setSelectedBrandForPermutations(brand);
    setIsPermutationModalOpen(true);
    setIsLoadingPermutations(true);
    setPermutationData(null);
    setPermutationFilter("");

    try {
      const res = await fetch(`/api/brands/${brand.id}`);
      const data = await res.json();
      if (res.ok) {
        setPermutationData(data);
      }
    } catch (err) {
      console.error("Failed to fetch brand permutations:", err);
    } finally {
      setIsLoadingPermutations(false);
    }
  };

  const filteredPermutations = permutationData?.permutations.filter((p) =>
    p.domain.toLowerCase().includes(permutationFilter.toLowerCase()) ||
    p.attackVector.toLowerCase().includes(permutationFilter.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Shield className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Brand Protection Asset Center
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              LIVE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Continuously scan, generate adversarial lookalike permutations, and detect homoglyph and subdomain typosquatting lures in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBrands}
            className="text-xs border-slate-700 hover:bg-slate-800 text-slate-300"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Sync Assets
          </Button>
          <Button
            variant="cyan"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold shadow-lg shadow-cyan-950/40"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Register Protected Brand
          </Button>
        </div>
      </div>

      {/* Feature 1: Live Brand Imposter & Lookalike Verification Console */}
      <Card glow="blue" className="p-5 border-blue-500/30 bg-gradient-to-br from-[#0c1322] via-[#090e1a] to-[#070b14]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Fingerprint className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Live Imposter & Lookalike Verification Console
              </h2>
              <p className="text-[11px] text-slate-400">
                Test any incoming hostname or URL against all active protected corporate brands using Levenshtein distance and homoglyph algorithms.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
            {brands.filter((b) => b.isActive !== false).length} Active Guards
          </span>
        </div>

        {/* Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={testDomainInput}
              onChange={(e) => setTestDomainInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunDomainTest()}
              placeholder="Enter suspicious domain or URL (e.g. paypa1.top, secure-login.b0fa-verify.com, g00gle.xyz)..."
              className="w-full rounded-xl border border-slate-700/80 bg-[#070b14] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
            />
          </div>
          <Button
            variant="cyan"
            size="sm"
            onClick={() => handleRunDomainTest()}
            isLoading={isTestingDomain}
            className="text-xs font-semibold px-4 whitespace-nowrap"
          >
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Run Match Engine
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          <span className="text-slate-500 font-mono text-[10px]">Test Quick Presets:</span>
          {[
            "paypa1.top",
            "g00gle-security-verify.com",
            "login.apple.com.auth-update.xyz",
            "micr0soft-portal.info",
            "bofa-customer-verify.com",
          ].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setTestDomainInput(preset);
                handleRunDomainTest(preset);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 hover:text-cyan-300 text-slate-300 font-mono text-[10px] border border-slate-700/60 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Domain Test Results Display */}
        {domainTestResult && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-[#070b14]/90 p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Tested Target:</span>
                <span className="text-xs font-mono font-semibold text-cyan-400">
                  {domainTestResult.parsedHostname}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  (Registrable: {domainTestResult.registrableDomain})
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  domainTestResult.hasMatch
                    ? "bg-red-950/80 text-red-400 border border-red-800/60"
                    : "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                }`}
              >
                {domainTestResult.hasMatch
                  ? `IMPOSTER DETECTED (${domainTestResult.matches.length} Brand Match)`
                  : "NO BRAND IMPERSONATION DETECTED"}
              </span>
            </div>

            {domainTestResult.hasMatch ? (
              <div className="space-y-3">
                {domainTestResult.matches.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-red-500/30 bg-red-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Targeted Brand:</span>
                        <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                          {m.brandName} ({m.officialDomain})
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-700/50">
                          {m.matchType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">{m.details}</p>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1">
                        <span>Levenshtein Distance: <strong className="text-white">{m.levenshteinDistance}</strong></span>
                        <span>•</span>
                        <span>Confidence Weight: <strong className="text-white">+{m.weight} pts</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-mono">Similarity Score</div>
                        <div className="text-base font-bold font-mono text-red-400">
                          {Math.round(m.similarityScore * 100)}%
                        </div>
                      </div>
                      <Link
                        href={`/analyze?url=${encodeURIComponent(`https://${domainTestResult.parsedHostname}`)}`}
                      >
                        <Button variant="outline" size="sm" className="text-xs border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/40">
                          Deep Scan in Lab
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/10 text-xs text-emerald-300 flex items-center justify-between">
                <span>The submitted domain does not trigger lookalike thresholds against currently monitored brand assets.</span>
                <Link href={`/analyze?url=${encodeURIComponent(`https://${domainTestResult.parsedHostname}`)}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:bg-emerald-950/30">
                    Run General Threat Check
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Feature 2: Protected Brand Assets Grid */}
      <Card>
        <CardHeader
          title={`Protected Brand Assets (${brands.length})`}
          description="Assets continuously monitored by the Levenshtein homoglyph and subdomain detection algorithms"
          icon={Shield}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-44 bg-slate-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No protected brand assets registered yet. Click &quot;Register Protected Brand&quot; to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((b) => {
              const isActive = b.isActive !== false;
              return (
                <div
                  key={b.id}
                  className={`rounded-xl border transition-all p-5 space-y-3.5 bg-[#0c121e] relative group hover:shadow-lg ${
                    isActive
                      ? "border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-950/20"
                      : "border-slate-800/50 opacity-75 hover:opacity-100"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 font-bold text-base shadow-inner">
                        {b.brandName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {b.brandName}
                        </h3>
                        <p className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                          <Globe className="h-3 w-3 text-slate-500" />
                          {b.officialDomain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteBrand(b.id, b.brandName)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                        title="Remove Brand"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Aliases */}
                  {b.aliases && b.aliases.length > 0 && (
                    <div className="text-[11px] text-slate-400 space-y-1">
                      <span className="font-semibold text-slate-300 text-[10px] uppercase tracking-wider">
                        Protected Aliases:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {b.aliases.map((alias: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-800/90 font-mono text-[10px] text-slate-300 border border-slate-700/60"
                          >
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPermutations(b)}
                      className="flex-1 text-xs border-slate-700 bg-slate-900/60 hover:bg-cyan-950/40 hover:border-cyan-500/50 hover:text-cyan-300 transition-all font-medium py-1.5 h-auto"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                      Scan Lookalikes
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const sampleDomain = `g00gle.xyz`.replace("google", b.officialDomain.split(".")[0]);
                        setTestDomainInput(sampleDomain);
                        handleRunDomainTest(sampleDomain);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }}
                      className="text-xs text-slate-400 hover:text-white hover:bg-slate-800 py-1.5 h-auto"
                      title="Quick test lookalike variant"
                    >
                      <Zap className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Footer status & Active Guard toggle */}
                  <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <button
                      onClick={() => handleToggleActive(b)}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                      title="Click to toggle active monitoring status"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActive
                            ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                            : "bg-slate-600"
                        }`}
                      />
                      <span className={isActive ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                        {isActive ? "Active Guard" : "Monitoring Paused"}
                      </span>
                    </button>
                    <span>Registered: {new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Feature 3: Adversarial Permutation & Lookalike Inspector Modal */}
      <Modal
        isOpen={isPermutationModalOpen}
        onClose={() => setIsPermutationModalOpen(false)}
        title={
          selectedBrandForPermutations
            ? `Adversarial Lookalike & Typosquat Workspace: ${selectedBrandForPermutations.brandName}`
            : "Brand Lookalike Workspace"
        }
        description="Pre-computed lookalike attack surface evaluated using Levenshtein distance, homoglyph substitutions, and deceptive subdomain cloaking."
      >
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {isLoadingPermutations ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Generating adversarial mutations and calculating similarity matrices...</p>
            </div>
          ) : permutationData ? (
            <div className="space-y-4">
              {/* Header Telemetry */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#070b14] border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Official Domain</div>
                  <div className="text-xs font-bold text-cyan-400 font-mono truncate">
                    {selectedBrandForPermutations?.officialDomain}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Adversarial Permutations</div>
                  <div className="text-xs font-bold text-white font-mono">
                    {permutationData.totalPermutations} Variants
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">Discovered Threats in DB</div>
                  <div className="text-xs font-bold text-red-400 font-mono">
                    {permutationData.relatedFindings.length} Active Findings
                  </div>
                </div>
              </div>

              {/* Filter bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={permutationFilter}
                    onChange={(e) => setPermutationFilter(e.target.value)}
                    placeholder="Filter permutations by domain or vector..."
                    className="w-full rounded-lg border border-slate-700 bg-[#0c121e] pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {filteredPermutations.length} of {permutationData.permutations.length}
                </span>
              </div>

              {/* Permutations Table / Cards */}
              <div className="space-y-2">
                {filteredPermutations.map((p, idx) => {
                  const severityColor =
                    p.severity === "CRITICAL"
                      ? "text-red-400 bg-red-950/50 border-red-800/40"
                      : p.severity === "HIGH"
                      ? "text-amber-400 bg-amber-950/50 border-amber-800/40"
                      : "text-blue-400 bg-blue-950/50 border-blue-800/40";

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-800 bg-[#0c121e] hover:border-slate-700 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-white truncate">
                            {p.domain}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${severityColor}`}>
                            {p.attackVector}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{p.technique}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 font-mono">Similarity</div>
                          <div className="text-xs font-bold font-mono text-cyan-400">
                            {Math.round(p.similarityScore * 100)}%
                          </div>
                        </div>

                        <Link
                          href={`/analyze?url=${encodeURIComponent(`https://${p.domain}`)}`}
                          target="_blank"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] text-slate-300 hover:text-cyan-300 hover:bg-slate-800 p-1.5 h-auto"
                            title="Run Analysis"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Related Findings from DB if any */}
              {permutationData.relatedFindings.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                    Historical Incidents Targetting This Brand in Database
                  </h4>
                  <div className="space-y-1.5">
                    {permutationData.relatedFindings.map((f: any) => (
                      <div
                        key={f.id}
                        className="p-2.5 rounded-lg border border-red-500/20 bg-red-950/20 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-white truncate">{f.domain}</p>
                          <p className="text-[10px] text-slate-400">{f.title}</p>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-900/60 text-red-300 font-bold ml-2">
                          {f.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </Modal>

      {/* Modal: Register Protected Brand */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Protected Corporate Brand Asset"
        description="Add a legitimate organization brand name and primary domain to enable automated lookalike and typosquatting detection."
      >
        <form onSubmit={handleCreateBrand} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-950/40 border border-red-500/30 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              required
              className="w-full rounded-lg border border-slate-700 bg-[#0c121e] px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Official Primary Domain (FQDN)
            </label>
            <input
              type="text"
              value={officialDomain}
              onChange={(e) => setOfficialDomain(e.target.value)}
              placeholder="e.g. acme.com"
              required
              className="w-full rounded-lg border border-slate-700 bg-[#0c121e] px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Domain Aliases / Sub-brands (Comma-separated)
            </label>
            <input
              type="text"
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              placeholder="e.g. acme-portal.com, acmestore.io"
              className="w-full rounded-lg border border-slate-700 bg-[#0c121e] px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cyan"
              size="sm"
              isLoading={isSubmitting}
            >
              Register Brand Asset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
