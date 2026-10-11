"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  AlertTriangle,
  FolderOpen,
  Radio,
  FileText,
  Activity,
  ArrowRight,
  ExternalLink,
  Cpu,
  Layers,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ThreatTrendChart } from "@/components/dashboard/threat-trend-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge, IntelStatusBadge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("Failed to load statistics");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-800/60 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 liquid-glass-card rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="liquid-glass-card rounded-2xl border border-red-500/30 p-8 text-center text-xs text-red-400">
        <AlertTriangle className="h-9 w-9 mx-auto mb-3 text-red-400" />
        <p className="font-semibold text-sm">Unable to connect to database metrics</p>
        <p className="text-slate-400 mt-1 max-w-md mx-auto">{error}</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button size="sm" variant="outline" onClick={fetchStats}>
            Retry Connection
          </Button>
          <Link href="/login">
            <Button size="sm" variant="cyan">
              Sign In to Console
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { metrics, riskDistribution, categoryStats, recentAnalyses } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cyber Shield Command Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl clay-card-cyan border border-cyan-500/40 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              {t("cyberShieldActive")}
            </span>
            <span className="text-[10px] font-mono text-cyan-300/70 border border-cyan-900/60 bg-cyan-950/30 px-2 py-0.5 rounded-md">
              {t("perimeterSurveillance")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-mono drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]">
            <ShieldAlert className="h-7 w-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            {t("Security Operations Console")}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {t("dash.socDesc")}
          </p>
        </div>
        <Link href="/analyzer" className="relative z-10 shrink-0">
          <Button variant="cyan" size="md" className="font-semibold text-xs shadow-liquid-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Search className="h-4 w-4 mr-2" />
            {t("Analyze Threat Vector")}
          </Button>
        </Link>
      </div>

      {/* Primary KPI Metrics Grid in Liquid Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Monitored Assets"
          value={metrics.totalAnalyses}
          subtitle="Scoped domains & URLs"
          icon={Activity}
          variant="cyan"
          trend="100% Lexical Safe"
          href="/brands"
        />
        <MetricCard
          title="Confirmed Threat Matches"
          value={metrics.threatIntelMatches}
          subtitle="Matched against feeds"
          icon={Radio}
          variant="red"
          trend="APWG / IoC Feed"
          href="/threat-intel"
        />
        <MetricCard
          title="Critical Risk Findings"
          value={metrics.criticalFindings}
          subtitle="Score >= 70 / 100"
          icon={ShieldAlert}
          variant="amber"
          trend="Immediate Takedown"
          href="/findings?severity=CRITICAL"
        />
        <MetricCard
          title="Open Investigations"
          value={metrics.openIncidents}
          subtitle={`${metrics.resolvedIncidents} resolved cases`}
          icon={FolderOpen}
          variant="blue"
          trend="Active Case Queue"
          href="/incidents"
        />
      </div>

      {/* Visual Threat Charts */}
      <ThreatTrendChart
        riskDistribution={riskDistribution}
        categoryStats={categoryStats}
      />

      {/* Recent Analysis Activity Table */}
      <Card glow="cyber" hudCorner={true}>
        <CardHeader
          title={t("Recent Threat Telemetry Stream")}
          description={t("Latest digital assets evaluated by the heuristic and brand protection engine")}
          icon={ShieldCheck}
          action={
            <Link href="/findings">
              <Button variant="outline" size="sm" className="text-xs">
                {t("View All Findings")}
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          }
        />

        {recentAnalyses.length === 0 ? (
          <div className="py-14 text-center text-xs text-slate-500 font-mono">
            <Search className="h-8 w-8 mx-auto mb-2.5 opacity-40 text-cyan-400" />
            {t("No threat analyses recorded yet. Submit a URL to begin monitoring.")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] text-cyan-300/80 font-mono text-[11px]">
                <tr>
                  <th className="pb-3 pl-2">{t("Target Asset Hostname")}</th>
                  <th className="pb-3">{t("Risk Score")}</th>
                  <th className="pb-3">{t("Severity")}</th>
                  <th className="pb-3">{t("Threat Intel")}</th>
                  <th className="pb-3">{t("Timestamp")}</th>
                  <th className="pb-3 text-right pr-2">{t("Action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] font-mono">
                {recentAnalyses.map((item: any) => (
                  <tr key={item.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="py-3.5 pl-2 font-semibold text-slate-200">
                      <div className="max-w-xs sm:max-w-sm truncate text-cyan-200/90 group-hover:text-cyan-300 transition-colors">
                        {item.normalizedHostname || item.submittedUrl}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`font-bold ${
                          item.riskScore >= 70
                            ? "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                            : item.riskScore >= 40
                            ? "text-orange-400"
                            : item.riskScore >= 20
                            ? "text-amber-400"
                            : "text-blue-400"
                        }`}
                      >
                        {item.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3.5">
                      <SeverityBadge severity={item.severity} size="sm" />
                    </td>
                    <td className="py-3.5">
                      <IntelStatusBadge status={item.intelligenceStatus} />
                    </td>
                    <td className="py-3.5 text-slate-400 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <Link href={`/findings?id=${item.id}`}>
                        <button className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-medium transition-colors">
                          {t("Inspect")} <ExternalLink className="h-3 w-3" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
