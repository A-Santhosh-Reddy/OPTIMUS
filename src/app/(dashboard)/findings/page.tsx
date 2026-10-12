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
        <h1 className="text-2xl font-bold tracking-tight text-[#E7F4F1] flex items-center gap-2">
          Threat Findings Repository
        </h1>
        <p className="text-xs text-[#A0B8B2] mt-1">
          Historical repository of analyzed URLs, detection signals, and correlation records.
        </p>
      </div>

      {/* Selected Detail View Overlay / Panel */}
      {selectedAnalysis && (
        <div className="space-y-4 rounded-2xl border border-[#28504A] bg-[#0B302D] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-[#193E39] pb-3">
            <h2 className="text-base font-bold text-[#E7F4F1] flex items-center gap-2 font-mono">
              <ShieldAlert className="h-5 w-5 text-[#00DCC2]" />
              Detailed Threat Inspection &bull; {selectedAnalysis.normalizedHostname}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAnalysis(null)}
              className="text-xs border-[#28504A] text-[#A0B8B2]"
            >
              Close Inspector
            </Button>
          </div>
          <AnalysisResultView analysis={selectedAnalysis} />
        </div>
      )}

      {/* Filter & Search Bar */}
      <Card glow="cyan">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute inset-y-0 left-3.5 my-auto text-[#00DCC2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hostname, domain, or submitted URL..."
              className="w-full rounded-xl bg-[#031C1B] border border-[#28504A] pl-10 pr-4 py-2.5 text-xs text-[#E7F4F1] placeholder-[#718C85] font-mono focus:border-[#00DCC2] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl bg-[#031C1B] border border-[#28504A] px-3 py-2.5 text-xs text-[#E7F4F1] font-mono focus:border-[#00DCC2] focus:outline-none"
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
              className="rounded-xl bg-[#031C1B] border border-[#28504A] px-3 py-2.5 text-xs text-[#E7F4F1] font-mono focus:border-[#00DCC2] focus:outline-none"
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
              <div key={i} className="h-12 bg-[#0B302D]/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#718C85]">
            No threat findings match the specified search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#193E39] bg-[#042422] text-[#A0B8B2] font-mono">
                <tr>
                  <th className="py-3 pl-3">Target Hostname</th>
                  <th className="py-3">Registrable Domain</th>
                  <th className="py-3">Risk Score</th>
                  <th className="py-3">Severity</th>
                  <th className="py-3">Threat Intel</th>
                  <th className="py-3">Signals</th>
                  <th className="py-3">Timestamp</th>
                  <th className="py-3 text-right pr-3">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#193E39] font-mono">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => loadAnalysisDetail(item.id)}
                    className="hover:bg-[#163632]/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 pl-3 font-semibold text-[#E7F4F1]">
                      <div className="max-w-xs truncate">{item.normalizedHostname || item.submittedUrl}</div>
                    </td>
                    <td className="py-3.5 text-[#A0B8B2]">{item.registrableDomain}</td>
                    <td className="py-3.5">
                      <span
                        className={`font-bold ${
                          item.riskScore >= 70
                            ? "text-[#FF6474]"
                            : item.riskScore >= 40
                            ? "text-[#FFB454]"
                            : item.riskScore >= 20
                            ? "text-[#F0D66B]"
                            : "text-[#00DCC2]"
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
                    <td className="py-3.5 text-[#A0B8B2]">
                      {item.signals?.length || 0} indicators
                    </td>
                    <td className="py-3.5 text-[#A0B8B2] text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3.5 text-right pr-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          loadAnalysisDetail(item.id);
                        }}
                        className="text-xs text-[#00DCC2] hover:text-[#20F5DB] font-semibold"
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
          <div className="flex items-center justify-between border-t border-[#193E39] pt-4 mt-4">
            <span className="text-xs text-[#A0B8B2] font-mono">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="border-[#28504A] text-[#A0B8B2]"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="border-[#28504A] text-[#A0B8B2]"
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
