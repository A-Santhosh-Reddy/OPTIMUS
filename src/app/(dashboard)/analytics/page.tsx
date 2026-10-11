"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  AlertOctagon,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Globe,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendCharts } from "@/components/dashboard/trend-charts";

export default function AnalyticsDashboardPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async (selectedPeriod: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/trends?period=${selectedPeriod}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load trend analytics");
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to load threat intelligence analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(period);
  }, [period]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              STRATEGIC TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
            Threat Trend Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated longitudinal intelligence on brand impersonation surges, TLD abuse vectors, and attack timing patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/10 font-mono text-xs">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  period === p
                    ? "bg-cyan-950 border border-cyan-400/50 text-cyan-300 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTrends(period)}
            disabled={isLoading}
            className="text-xs font-mono"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
          {error}
        </div>
      )}

      {/* KPI Highlights Bar */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <Card glow="cyan">
            <div className="p-4">
              <span className="text-[10px] text-slate-400 uppercase">Analyzed Ingestions</span>
              <p className="text-2xl font-bold text-white mt-1">
                {data.severitySummary?.total || 0}
              </p>
              <p className="text-[10px] text-cyan-400 mt-0.5">Last {period.toUpperCase()} window</p>
            </div>
          </Card>

          <Card glow="red">
            <div className="p-4">
              <span className="text-[10px] text-red-400 uppercase">Critical Threat Vol.</span>
              <p className="text-2xl font-bold text-red-400 mt-1">
                {data.severitySummary?.critical || 0}
              </p>
              <p className="text-[10px] text-red-400/70 mt-0.5">Urgent triage needed</p>
            </div>
          </Card>

          <Card glow="blue">
            <div className="p-4">
              <span className="text-[10px] text-sky-400 uppercase">Mean Severity Index</span>
              <p className="text-2xl font-bold text-sky-300 mt-1">
                {data.avgRiskScore || 0}
                <span className="text-xs text-slate-500">/100</span>
              </p>
              <p className="text-[10px] text-sky-400/70 mt-0.5">Composite risk average</p>
            </div>
          </Card>

          <Card glow="amber">
            <div className="p-4">
              <span className="text-[10px] text-amber-400 uppercase">Targeted Brands</span>
              <p className="text-2xl font-bold text-amber-300 mt-1">
                {data.topTargetedBrands?.length || 0}
              </p>
              <p className="text-[10px] text-amber-400/70 mt-0.5">Impersonated identities</p>
            </div>
          </Card>
        </div>
      )}

      {/* Charts Area */}
      {isLoading ? (
        <div className="rounded-2xl border border-cyan-500/30 liquid-glass-card p-16 text-center animate-pulse hud-corner">
          <TrendingUp className="h-10 w-10 mx-auto text-cyan-400 animate-pulse mb-3" />
          <h3 className="text-sm font-semibold text-slate-100 font-mono tracking-wide">
            Aggregating SOC Historical Telemetry...
          </h3>
          <p className="text-xs text-cyan-300/60 font-mono mt-1">
            Compiling time-series volume &bull; Cross-referencing TLD registries &bull; Correlating brand vectors
          </p>
        </div>
      ) : data ? (
        <TrendCharts
          dailyBreakdown={data.dailyBreakdown || []}
          hourlyDistribution={data.hourlyDistribution || []}
          topTargetedBrands={data.topTargetedBrands || []}
          tldAbuse={data.tldAbuse || []}
          topSignals={data.topSignals || []}
        />
      ) : null}
    </div>
  );
}
