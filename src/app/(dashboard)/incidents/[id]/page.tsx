"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  User,
  Send,
  Download,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Radio,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge, StatusBadge, IntelStatusBadge } from "@/components/ui/badge";
import { generateThreatInvestigationPdf } from "@/lib/pdf/report-generator";

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [incident, setIncident] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newNote, setNewNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<string>("");
  const [conclusion, setConclusion] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const fetchIncident = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/incidents/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load incident");
      setIncident(data.incident);
      setStatusUpdate(data.incident.status);
      setConclusion(data.incident.analystConclusion || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/incidents/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      setNewNote("");
      await fetchIncident();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusUpdate,
          analystConclusion: conclusion,
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchIncident();
      alert("Incident status updated successfully.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!incident) return;
    try {
      const doc = generateThreatInvestigationPdf({
        reportId: `INC-RPT-${incident.id.substring(0, 8).toUpperCase()}`,
        generatedAt: new Date().toISOString(),
        generatedBy: "SOC Lead Analyst",
        organizationName: "Security Operations",
        analysis: {
          id: incident.analysis.id,
          submittedUrl: incident.analysis.submittedUrl,
          normalizedHostname: incident.analysis.normalizedHostname,
          registrableDomain: incident.analysis.registrableDomain,
          riskScore: incident.analysis.riskScore,
          severity: incident.analysis.severity,
          heuristicScore: incident.analysis.heuristicScore,
          intelligenceStatus: incident.analysis.intelligenceStatus,
          createdAt: incident.analysis.createdAt,
          aiExplanation: incident.analysis.aiExplanation,
          limitations: JSON.parse(incident.analysis.limitations || "[]"),
          signals: incident.analysis.signals || [],
          brandSimilarities: incident.analysis.brandSimilarities || [],
          intelResults: incident.analysis.intelResults || [],
        },
        incident: {
          id: incident.id,
          title: incident.title,
          description: incident.description,
          status: incident.status,
          severity: incident.severity,
          assignedUser: incident.assignedUser,
          analystConclusion: incident.analystConclusion,
          notes: incident.notes.map((n: any) => ({
            authorName: n.authorName,
            content: n.content,
            createdAt: n.createdAt,
          })),
        },
      });

      doc.save(`Incident-Report-${incident.id}-${Date.now()}.pdf`);
    } catch (err) {
      alert("Failed to export PDF report.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-400">Loading incident details...</div>;
  }

  if (error || !incident) {
    return (
      <div className="p-8 text-center text-red-400">
        <p>Incident not found or unauthorized.</p>
        <Link href="/incidents">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Incidents
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/incidents"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Incident Cases
        </Link>
        <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="text-xs">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export Forensic PDF Report
        </Button>
      </div>

      {/* Incident Case Header Card */}
      <Card glow="blue">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={incident.status} />
              <SeverityBadge severity={incident.severity} size="sm" />
              <span className="text-xs font-mono text-slate-500">Case ID: {incident.id}</span>
            </div>
            <h1 className="text-xl font-bold text-white">{incident.title}</h1>
            <p className="text-xs text-slate-400 leading-relaxed">{incident.description}</p>
          </div>

          {/* Quick Info Panel */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 text-xs font-mono space-y-1.5 w-full lg:w-72">
            <div className="flex justify-between text-slate-400">
              <span>Target Host:</span>
              <span className="text-cyan-400 truncate max-w-[140px]">
                {incident.analysis?.normalizedHostname}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Risk Score:</span>
              <span className="text-red-400 font-bold">{incident.analysis?.riskScore}/100</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Assignee:</span>
              <span className="text-slate-200">{incident.assignedUser?.name || "Unassigned"}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: Incident Status Transition Form & Linked Threat Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notes Timeline & Investigation Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Linked Threat Evidence */}
          <Card>
            <CardHeader
              title="Correlated Threat Analysis Evidence"
              description="Signals and brand findings tied to this incident case"
              icon={ShieldAlert}
              action={
                <Link href={`/findings?id=${incident.analysis.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Inspect Finding <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              }
            />
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-[#0c121e] border border-slate-800 font-mono flex items-center justify-between">
                <span className="text-slate-400">Submitted URL:</span>
                <span className="text-slate-200 truncate max-w-md">{incident.analysis.submittedUrl}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0c121e] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Threat Intel Feeds:</span>
                <IntelStatusBadge status={incident.analysis.intelligenceStatus} />
              </div>
            </div>
          </Card>

          {/* Investigation Notes Timeline */}
          <Card>
            <CardHeader
              title="Investigation Activity & Notes"
              description="Chronological log of forensic observations and analyst actions"
              icon={Clock}
            />

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 mb-6">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add investigation note, registrar response, or forensic finding..."
                className="w-full rounded-lg border border-slate-700 bg-[#0c121e] p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmittingNote}
                  className="text-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Post Activity Note
                </Button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {incident.notes?.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No notes recorded yet.</p>
              ) : (
                incident.notes.map((note: any) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-slate-800 bg-[#0c121e] p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <User className="h-3 w-3 text-blue-400" />
                        {note.authorName}
                      </span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Col: Status Management & Conclusion */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Case Status & Disposition"
              description="Update workflow phase and analyst conclusion"
              icon={FileCheck2}
            />

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Workflow Status
                </label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-[#0c121e] px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="NEW">New (Triage)</option>
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="ESCALATED">Escalated</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="FALSE_POSITIVE">False Positive</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Final Analyst Conclusion / Action Taken
                </label>
                <textarea
                  rows={4}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="e.g. Domain confirmed malicious phishing portal. DNS sinkhole applied and abuse takedown filed with registrar."
                  className="w-full rounded-lg border border-slate-700 bg-[#0c121e] p-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <Button
                variant="cyan"
                size="sm"
                onClick={handleUpdateStatus}
                isLoading={isUpdatingStatus}
                className="w-full font-semibold text-xs"
              >
                Save Incident Updates
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
