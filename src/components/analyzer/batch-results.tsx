"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  Search,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Filter,
} from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { SeverityBadge, IntelStatusBadge } from "../ui/badge";
import { BatchAnalysisItem } from "@/app/api/analyze/batch/route";
import Link from "next/link";

interface BatchResultsProps {
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
    failed: number;
  };
  results: BatchAnalysisItem[];
}

export function BatchResults({ summary, results }: BatchResultsProps) {
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = useMemo(() => {
    return results.filter((item) => {
      const matchesSeverity =
        severityFilter === "ALL" || item.severity === severityFilter;
      const matchesSearch =
        searchQuery === "" ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hostname.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [results, severityFilter, searchQuery]);

  const handleExportCsv = () => {
    const headers = [
      "Index",
      "URL",
      "Hostname",
      "Risk Score",
      "Severity",
      "Signal Count",
      "Brand Matches",
      "Intel Status",
      "Status",
    ];

    const rows = results.map((r) => [
      r.index + 1,
      `"${r.url.replace(/"/g, '""')}"`,
      `"${r.hostname.replace(/"/g, '""')}"`,
      r.riskScore,
      r.severity,
      r.signalCount,
      r.brandMatchCount,
      r.intelStatus,
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `optimus_batch_scan_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-[#0B302D] border border-[#193E39] text-center">
          <p className="text-[10px] text-[#A0B8B2] font-mono uppercase">Total Processed</p>
          <p className="text-xl font-bold font-mono text-[#E7F4F1] mt-1">{summary.total}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#FF6474]/15 border border-[#FF6474]/30 text-center">
          <p className="text-[10px] text-[#FF6474] font-mono uppercase">Critical Threats</p>
          <p className="text-xl font-bold font-mono text-[#FF6474] mt-1">{summary.critical}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#FFB454]/15 border border-[#FFB454]/30 text-center">
          <p className="text-[10px] text-[#FFB454] font-mono uppercase">High Risk</p>
          <p className="text-xl font-bold font-mono text-[#FFB454] mt-1">{summary.high}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#F0D66B]/15 border border-[#F0D66B]/30 text-center">
          <p className="text-[10px] text-[#F0D66B] font-mono uppercase">Medium</p>
          <p className="text-xl font-bold font-mono text-[#F0D66B] mt-1">{summary.medium}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#45D6A0]/15 border border-[#45D6A0]/30 text-center">
          <p className="text-[10px] text-[#45D6A0] font-mono uppercase">Low / Benign</p>
          <p className="text-xl font-bold font-mono text-[#45D6A0] mt-1">{summary.low + summary.info}</p>
        </div>

        <div className="p-3 rounded-xl bg-[#031C1B] border border-[#193E39] text-center">
          <p className="text-[10px] text-[#718C85] font-mono uppercase">Failed / Invalid</p>
          <p className="text-xl font-bold font-mono text-[#718C85] mt-1">{summary.failed}</p>
        </div>
      </div>

      {/* Main Results Table Card */}
      <Card>
        <CardHeader
          title="Batch Scan Findings"
          description={`Showing ${filteredResults.length} of ${results.length} evaluated endpoints`}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs font-mono border-[#28504A] text-[#A0B8B2]"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export CSV
            </Button>
          }
        />

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pt-1">
          {/* Severity Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? "bg-[#00DCC2]/15 border-[#00DCC2] text-[#00DCC2] font-bold"
                    : "bg-[#0B302D] border-[#193E39] text-[#A0B8B2] hover:text-[#E7F4F1] hover:bg-[#163632]"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#718C85]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by domain or URL..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs font-mono bg-[#031C1B] border border-[#28504A] text-[#E7F4F1] placeholder-[#718C85] focus:border-[#00DCC2] focus:outline-none"
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto rounded-xl border border-[#193E39]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#042422] border-b border-[#193E39] text-[#A0B8B2]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Target Asset URL</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Signals</th>
                <th className="py-2.5 px-3">Intel</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#193E39] text-[#E7F4F1]">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#718C85]">
                    No results matching current filter criteria
                  </td>
                </tr>
              ) : (
                filteredResults.map((item) => (
                  <tr key={item.index} className="hover:bg-[#163632]/50 transition-colors">
                    <td className="py-2.5 px-3 text-[#718C85]">{item.index + 1}</td>
                    <td className="py-2.5 px-3 max-w-[280px] truncate" title={item.url}>
                      <span className="font-semibold text-[#E7F4F1]">{item.hostname || item.url}</span>
                      <p className="text-[10px] text-[#718C85] truncate">{item.url}</p>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#E7F4F1]">
                      {item.riskScore}
                      <span className="text-[10px] text-[#718C85]">/100</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[#00DCC2] font-bold">{item.signalCount}</span>
                      {item.brandMatchCount > 0 && (
                        <span className="ml-1 text-[10px] text-[#FFB454]">({item.brandMatchCount} brand)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <IntelStatusBadge status={item.intelStatus} />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        href={`/analyzer?url=${encodeURIComponent(item.url)}`}
                        className="inline-flex items-center gap-1 text-[11px] text-[#00DCC2] hover:text-[#20F5DB] bg-[#00DCC2]/10 border border-[#00DCC2]/30 px-2 py-1 rounded transition-colors"
                      >
                        Inspect <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
