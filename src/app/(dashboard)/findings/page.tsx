"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  Search,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FolderPlus,
  Radio,
  FileCheck2,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge, IntelStatusBadge } from "@/components/ui/badge";
import { AnalysisResultView } from "@/components/analyzer/analysis-result-view";

export default function FindingsPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

  const [items, setItems] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const initialSeverity = searchParams.get("severity");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState(initialSeverity || "ALL");
  const [intelFilter, setIntelFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchFindings();
  }, [page, severityFilter, intelFilter]);

  useEffect(() => {
    if (initialId) {
      loadAnalysisDetail(initialId);
    }
  }, [initialId]);

  const fetchFindings = async () => {
    setIsLoadingList(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        severity: severityFilter,
        intelStatus: intelFilter,
        q: searchQuery,
      });
      const res = await fetch(`/api/analyses?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);

        if (initialId && !selectedAnalysis) {
          loadAnalysisDetail(initialId);
        }
      }
    } catch (err) {
      console.error("Failed to load findings:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFindings();
  };

  const loadAnalysisDetail = async (id: string) => {
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/analyses/${id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("Failed to load analysis detail:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Threat Findings Repository
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical repository of analyzed URLs, detection signals, and correlation records.
        </p>
      </div>

      {/* Selected Detail View Overlay / Panel in Liquid Glass */}
      {selectedAnalysis && (
        <div className="space-y-4 rounded-2xl border border-cyan-500/40 liquid-glass-card p-6 shadow-liquid-cyan hud-corner">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <ShieldAlert className="h-5 w-5 text-cyan-400" />
              Detailed Threat Inspection &bull; {selectedAnalysis.normalizedHostname}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAnalysis(null)}
              className="text-xs"
            >
              Close Inspector
            </Button>
          </div>
          <AnalysisResultView analysis={selectedAnalysis} />
        </div>
      )}

      {/* Filter & Search Bar in Liquid Glass */}
      <Card glow="cyan" hudCorner={true}>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute inset-y-0 left-3.5 my-auto text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hostname, domain, or submitted URL..."
              className="liquid-glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setPage(1);
              }}
              className="liquid-glass-input rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={intelFilter}
              onChange={(e) => {
                setIntelFilter(e.target.value);
                setPage(1);
              }}
              className="liquid-glass-input rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono"
            >
              <option value="ALL">All Threat Intel</option>
              <option value="MATCH_FOUND">Match Found</option>
              <option value="NO_MATCH">No Match</option>
              <option value="INCONCLUSIVE">Inconclusive</option>
              <option value="NOT_CONFIGURED">Not Configured</option>
            </select>

            <Button type="submit" variant="cyan" size="sm">
              <Filter className="h-3.5 w-3.5 mr-1" />
              Apply Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Findings Table */}
      <Card>
        <CardHeader
          title={`Identified Threat Findings (${totalCount})`}
          description="Click any row to open the complete evidence breakdown and SOC inspection panel"
          icon={ShieldAlert}
        />

        {isLoadingList ? (
          <div className="space-y-2 py-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No threat findings match the specified search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="pb-3 pl-2">Target Hostname</th>
                  <th className="pb-3">Registrable Domain</th>
                  <th className="pb-3">Risk Score</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Threat Intel</th>
                  <th className="pb-3">Signals</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right pr-2">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => loadAnalysisDetail(item.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 pl-2 font-semibold text-slate-200">
                      <div className="max-w-xs truncate">{item.normalizedHostname || item.submittedUrl}</div>
                    </td>
                    <td className="py-3.5 text-slate-400">{item.registrableDomain}</td>
                    <td className="py-3.5">
                      <span
                        className={`font-bold ${
                          item.riskScore >= 70
                            ? "text-red-400"
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
                    <td className="py-3.5 text-slate-400">
                      {item.signals?.length || 0} indicators
                    </td>
                    <td className="py-3.5 text-slate-400 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadAnalysisDetail(item.id);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4">
            <span className="text-xs text-slate-400 font-mono">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
