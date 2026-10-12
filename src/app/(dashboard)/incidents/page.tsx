"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileCheck2,
  AlertTriangle,
  FolderOpen,
  Filter,
  Search,
  ExternalLink,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge, StatusBadge } from "@/components/ui/badge";

export default function IncidentsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");
  const initialSeverity = searchParams.get("severity");

  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus || "ALL");
  const [severityFilter, setSeverityFilter] = useState(initialSeverity || "ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, severityFilter]);

  const fetchIncidents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        severity: severityFilter,
        q: searchQuery,
      });
      const res = await fetch(`/api/incidents?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setIncidents(data.incidents || []);
      }
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIncidents();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            SOC Incident Response Cases
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage active threat investigations, assign SOC analysts, record conclusions, and track resolution timelines.
          </p>
        </div>
        <Link href="/analyzer">
          <Button variant="primary" size="sm" className="font-semibold text-xs">
            Open New Investigation
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute inset-y-0 left-3 my-auto text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case title, description, or target hostname..."
              className="w-full rounded-lg border border-slate-700 bg-[#0c121e] pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-[#0c121e] px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
              <option value="FALSE_POSITIVE">False Positive</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-[#0c121e] px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <Button type="submit" variant="secondary" size="sm">
              <Filter className="h-3.5 w-3.5 mr-1" />
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Incident Cases Board / Table */}
      <Card>
        <CardHeader
          title={`Active Incident Cases (${incidents.length})`}
          description="Click any case to open the full investigation timeline, notes, and forensic reporting"
          icon={FileCheck2}
        />

        {isLoading ? (
          <div className="space-y-3 py-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-slate-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No incident response cases found matching criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id}`}
                className="block p-4 rounded-xl border border-slate-800 bg-[#0c121e] hover:border-slate-700 hover:bg-slate-800/40 transition-all text-xs group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 text-sm group-hover:text-blue-400 transition-colors">
                        {incident.title}
                      </span>
                      <StatusBadge status={incident.status} />
                      <SeverityBadge severity={incident.severity} size="sm" />
                    </div>
                    <p className="text-slate-400 line-clamp-1">{incident.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                      <span className="text-cyan-400 truncate">
                        Target: {incident.analysis?.normalizedHostname || "Asset"}
                      </span>
                      <span>
                        Assignee: {incident.assignedUser?.name || "Unassigned"}
                      </span>
                      <span>
                        Created: {new Date(incident.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button variant="outline" size="sm" className="text-xs group-hover:border-blue-500/40">
                      Open Investigation
                      <ArrowRight className="h-3.5 w-3.5 ml-1 text-blue-400" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
