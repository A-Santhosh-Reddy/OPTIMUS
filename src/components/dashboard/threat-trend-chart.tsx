"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader } from "../ui/card";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ThreatChartsProps {
  riskDistribution: Array<{ name: string; count: number; color: string }>;
  categoryStats: Array<{ category: string; count: number }>;
}

export function ThreatTrendChart({ riskDistribution, categoryStats }: ThreatChartsProps) {
  const { t } = useLanguage();

  const localizedRisk = riskDistribution.map((entry) => ({
    ...entry,
    name: t(entry.name),
  }));

  const localizedCategory = categoryStats.map((entry) => ({
    ...entry,
    category: t(entry.category),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Distribution Bar Chart */}
      <Card glow="blue">
        <CardHeader
          title={t("Risk Level Distribution")}
          description={t("Distribution of analyzed digital assets across composite risk tiers")}
          icon={BarChart3}
        />
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={localizedRisk} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0e1526",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f8fafc",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detection Signal Category Stats */}
      <Card glow="cyan">
        <CardHeader
          title={t("Threat Indicators by Category")}
          description={t("Breakdown of specific heuristic and brand impersonation signals")}
          icon={PieIcon}
        />
        <div className="h-64 w-full flex items-center justify-center">
          {categoryStats.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono">{t("No detection signals recorded yet")}</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={localizedCategory}
                margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
              >
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="#64748b"
                  fontSize={9}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0e1526",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#f8fafc",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
