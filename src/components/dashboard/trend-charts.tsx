"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader } from "../ui/card";
import { TrendingUp, Clock, Globe, ShieldAlert, Target } from "lucide-react";

interface TrendChartsProps {
  dailyBreakdown: Array<{
    date: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  }>;
  hourlyDistribution: Array<{ hour: number; count: number }>;
  topTargetedBrands: Array<{ brandName: string; attackCount: number }>;
  tldAbuse: Array<{
    tld: string;
    totalAnalyses: number;
    maliciousCount: number;
    abuseRate: number;
  }>;
  topSignals: Array<{ signalType: string; count: number }>;
}

export function TrendCharts({
  dailyBreakdown,
  hourlyDistribution,
  topTargetedBrands,
  tldAbuse,
  topSignals,
}: TrendChartsProps) {
  // Format dates for display (MM/DD)
  const formattedDaily = dailyBreakdown.map((d) => ({
    ...d,
    displayDate: d.date.slice(5),
  }));

  const maxBrandCount = topTargetedBrands.length > 0 ? topTargetedBrands[0].attackCount : 1;

  return (
    <div className="space-y-6">
      {/* 1. Time-Series Daily Volume & Severity Breakdown */}
      <Card glow="cyber">
        <CardHeader
          title="Daily Threat Volume & Severity Progression"
          description="Timeline distribution of analyzed threats by risk classification"
          icon={TrendingUp}
        />
        <div className="h-72 w-full mt-2">
          {formattedDaily.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
              No historical analysis telemetry recorded yet for this time window
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedDaily} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="displayDate" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1a38",
                    borderColor: "rgba(6, 182, 212, 0.4)",
                    borderRadius: "0.75rem",
                    fontSize: "11px",
                    color: "#f8fafc",
                    fontFamily: "monospace",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "10px" }}
                />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" fillOpacity={1} fill="url(#colorCritical)" name="Critical" />
                <Area type="monotone" dataKey="high" stroke="#f97316" fillOpacity={1} fill="url(#colorHigh)" name="High" />
                <Area type="monotone" dataKey="medium" stroke="#eab308" fillOpacity={1} fill="url(#colorMedium)" name="Medium" />
                <Area type="monotone" dataKey="low" stroke="#10b981" fillOpacity={1} fill="url(#colorLow)" name="Low / Benign" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Grid: Brand Heatmap & TLD Abuse Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Targeted Brands */}
        <Card glow="blue">
          <CardHeader
            title="Most Targeted Brand Assets"
            description="Leading corporate identities spoofed by threat actors"
            icon={Target}
          />
          <div className="space-y-3 mt-1">
            {topTargetedBrands.length === 0 ? (
              <p className="text-slate-500 font-mono text-xs text-center py-8">
                No brand impersonations recorded yet
              </p>
            ) : (
              topTargetedBrands.map((brand, idx) => {
                const percentage = Math.round((brand.attackCount / maxBrandCount) * 100);
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-200">{brand.brandName}</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {brand.attackCount} attack{brand.attackCount > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 border border-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Top Abused TLDs */}
        <Card glow="cyan">
          <CardHeader
            title="Top Abused TLDs Ranking"
            description="Highest concentration of malicious registrable apex domains"
            icon={Globe}
          />
          <div className="space-y-2 mt-1 max-h-[300px] overflow-y-auto pr-1">
            {tldAbuse.length === 0 ? (
              <p className="text-slate-500 font-mono text-xs text-center py-8">
                No TLD abuse patterns identified
              </p>
            ) : (
              tldAbuse.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">{item.tld}</span>
                    <span className="text-slate-500 text-[10px]">({item.totalAnalyses} analyzed)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-400 font-semibold">{item.maliciousCount} threats</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.abuseRate >= 50
                          ? "bg-red-950/80 text-red-300 border border-red-500/40"
                          : "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {item.abuseRate}% Abuse
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Grid: Hourly Histogram & Top Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Attack Distribution */}
        <Card>
          <CardHeader
            title="Attack Activity by Hour of Day"
            description="Campaign deployment cadence across UTC time hours"
            icon={Clock}
          />
          <div className="h-56 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={9} tickLine={false} tickFormatter={(h) => `${h}:00`} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1a38",
                    borderColor: "rgba(6, 182, 212, 0.4)",
                    borderRadius: "0.75rem",
                    fontSize: "11px",
                    color: "#f8fafc",
                    fontFamily: "monospace",
                  }}
                  formatter={(value: any) => [`${value} detections`, "Activity"]}
                  labelFormatter={(label) => `${label}:00 UTC`}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Heuristic Signals Flagged */}
        <Card>
          <CardHeader
            title="Most Triggered Heuristic Signals"
            description="Dominant structural and behavioral phishing vectors"
            icon={ShieldAlert}
          />
          <div className="space-y-2.5 mt-1 max-h-[224px] overflow-y-auto pr-1 text-xs font-mono">
            {topSignals.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No signals recorded</p>
            ) : (
              topSignals.map((sig, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-white/[0.08]"
                >
                  <span className="text-slate-300 truncate max-w-[75%]" title={sig.signalType}>
                    {sig.signalType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 font-bold shrink-0">
                    {sig.count}x
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
