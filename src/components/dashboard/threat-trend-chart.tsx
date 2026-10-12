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
  CartesianGrid,
} from "recharts";
import { Card, CardHeader } from "../ui/card";
import { BarChart3, PieChart as PieIcon } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ThreatChartsProps {
  riskDistribution: Array<{ name: string; count: number; color: string }>;
  categoryStats: Array<{ category: string; count: number }>;
}

const SEVERITY_COLOR_MAP: Record<string, string> = {
  CRITICAL: "#FF6474",
  HIGH: "#FFB454",
  MEDIUM: "#F0D66B",
  LOW: "#45D6A0",
};

export function ThreatTrendChart({ riskDistribution, categoryStats }: ThreatChartsProps) {
  const { t } = useLanguage();

  const localizedRisk = riskDistribution.map((entry) => {
    const key = entry.name.toUpperCase();
    const mappedColor = SEVERITY_COLOR_MAP[key] || entry.color;
    return {
      ...entry,
      name: t(entry.name),
      color: mappedColor,
    };
  });

  const localizedCategory = categoryStats.map((entry) => ({
    ...entry,
    category: t(entry.category),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Distribution Bar Chart */}
      <Card glow="cyber">
        <CardHeader
          title={t("Risk Level Distribution")}
          description={t("Distribution of analyzed digital assets across composite risk tiers")}
          icon={BarChart3}
        />
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={localizedRisk} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(40, 80, 74, 0.25)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#718C85"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#193E39" }}
              />
              <YAxis
                stroke="#718C85"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#193E39" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B302D",
                  borderColor: "#28504A",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#E7F4F1",
                  boxShadow: "0 8px 24px rgba(3, 28, 27, 0.7)",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {localizedRisk.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detection Signal Category Stats */}
      <Card glow="cyber">
        <CardHeader
          title={t("Threat Indicators by Category")}
          description={t("Breakdown of specific heuristic and brand impersonation signals")}
          icon={PieIcon}
        />
        <div className="h-64 w-full flex items-center justify-center">
          {categoryStats.length === 0 ? (
            <p className="text-xs text-[#718C85] font-mono">{t("No detection signals recorded yet")}</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={localizedCategory}
                margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(40, 80, 74, 0.25)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#718C85"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#193E39" }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="#718C85"
                  fontSize={9}
                  tickLine={false}
                  axisLine={{ stroke: "#193E39" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B302D",
                    borderColor: "#28504A",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "#E7F4F1",
                    boxShadow: "0 8px 24px rgba(3, 28, 27, 0.7)",
                  }}
                />
                <Bar dataKey="count" fill="#00DCC2" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
