"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  Radio,
  Sparkles,
  Download,
  FolderPlus,
  FolderOpen,
  AlertTriangle,
  Info,
  Layers,
  ArrowUpRight,
  ArrowRight,
  ExternalLink,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { SeverityBadge, IntelStatusBadge } from "../ui/badge";
import { Modal } from "../ui/modal";
import { generateThreatInvestigationPdf } from "@/lib/pdf/report-generator";
import { WhoisPanel } from "./whois-panel";

interface AnalysisResultViewProps {
  analysis: any;
  userRole?: string;
  userName?: string;
  onIncidentCreated?: (incident: any) => void;
}

export function AnalysisResultView({
  analysis,
  userRole = "ANALYST",
  userName = "Analyst",
  onIncidentCreated,
}: AnalysisResultViewProps) {
  const router = useRouter();
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [createdIncident, setCreatedIncident] = useState<any | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("HIGH");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [isSubmittingIncident, setIsSubmittingIncident] = useState(false);
  const [incidentSuccessMsg, setIncidentSuccessMsg] = useState<string | null>(null);
  const [incidentError, setIncidentError] = useState<string | null>(null);

  // Sync state whenever analysis prop changes
  useEffect(() => {
    if (analysis) {
      const hostname = analysis.normalizedHostname || analysis.submittedUrl || "Threat Asset";
      const score = analysis.riskScore ?? 0;
      const sev = analysis.severity || "HIGH";
      setIncidentTitle(`Suspicious Asset Investigation: ${hostname}`);
      setIncidentDescription(
        `Automated threat analysis flagged risk score ${score}/100 (${sev}) for target ${analysis.submittedUrl || hostname}. Potential brand impersonation, high-entropy subdomain obfuscation, or credential harvesting lure.`
      );
      setSelectedSeverity(sev);

      // Check if this analysis already has an associated incident
      if (analysis.incidents && analysis.incidents.length > 0) {
        setCreatedIncident(analysis.incidents[0]);
      } else {
        setCreatedIncident(null);
      }
    }
  }, [analysis]);

  // PDF Report Download
  const handleDownloadPdf = () => {
    try {
      const doc = generateThreatInvestigationPdf({
        reportId: `RPT-${Date.now().toString(36).toUpperCase()}`,
        generatedAt: new Date().toISOString(),
        generatedBy: userName,
        organizationName: "Security Operations",
        analysis: {
          id: analysis.id,
          submittedUrl: analysis.submittedUrl,
          normalizedHostname: analysis.normalizedHostname,
          registrableDomain: analysis.registrableDomain,
          riskScore: analysis.riskScore,
          severity: analysis.severity,
          heuristicScore: analysis.heuristicScore,
          intelligenceStatus: analysis.intelligenceStatus,
          createdAt: analysis.createdAt || new Date().toISOString(),
          aiExplanation: analysis.aiExplanation,
          limitations: Array.isArray(analysis.limitations)
            ? analysis.limitations
            : JSON.parse(analysis.limitations || "[]"),
          signals: analysis.signals || [],
          brandSimilarities: analysis.brandSimilarities || [],
          intelResults: analysis.intelResults || [],
        },
      });

      doc.save(`Threat-Report-${analysis.normalizedHostname || "asset"}-${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to compile PDF report.");
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingIncident(true);
    setIncidentSuccessMsg(null);
    setIncidentError(null);
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysis.id || analysis.normalizedHostname,
          submittedUrl: analysis.submittedUrl,
          hostname: analysis.normalizedHostname,
          title: incidentTitle.trim(),
          description: incidentDescription.trim(),
          severity: selectedSeverity,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create incident");

      setCreatedIncident(data.incident);
      setIncidentSuccessMsg("SOC Incident Case opened successfully!");
      if (onIncidentCreated) onIncidentCreated(data.incident);

      // Auto-navigate after 1.2s or allow instant click
      setTimeout(() => {
        setIsIncidentModalOpen(false);
        setIncidentSuccessMsg(null);
        router.push(`/incidents/${data.incident.id}`);
      }, 1200);
    } catch (err: any) {
      setIncidentError(err.message || "Failed to create incident case");
    } finally {
      setIsSubmittingIncident(false);
    }
  };

  const limitationsList: string[] = Array.isArray(analysis.limitations)
    ? analysis.limitations
    : JSON.parse(analysis.limitations || "[]");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Risk Score & Quick Actions */}
      <Card
        glow={
          analysis.severity === "CRITICAL"
            ? "red"
            : analysis.severity === "HIGH"
            ? "amber"
            : "cyan"
        }
        className="border-[#28504A]"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <SeverityBadge severity={analysis.severity} size="lg" />
              <IntelStatusBadge status={analysis.intelligenceStatus} />
              <span className="text-xs text-[#A0B8B2] font-mono">
                Analyzed: {new Date(analysis.createdAt || Date.now()).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <p className="text-xs font-mono text-[#A0B8B2]">Target Asset Hostname:</p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#E7F4F1] font-mono break-all flex items-center gap-2">
                {analysis.normalizedHostname || analysis.submittedUrl}
              </h2>
            </div>
            <p className="text-xs text-[#A0B8B2] break-all">
              <span className="text-[#718C85] font-mono">Full URL: </span>
              {analysis.submittedUrl}
            </p>
          </div>

          {/* Risk Score Gauge & CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#031C1B] border border-[#193E39] w-full sm:w-36 text-center">
              <span className="text-[11px] font-semibold text-[#A0B8B2] uppercase tracking-wider">
                Risk Score
              </span>
              <span
                className={`text-4xl font-bold font-mono my-1 ${
                  analysis.riskScore >= 70
                    ? "text-[#FF6474]"
                    : analysis.riskScore >= 40
                    ? "text-[#FFB454]"
                    : analysis.riskScore >= 20
                    ? "text-[#F0D66B]"
                    : "text-[#00DCC2]"
                }`}
              >
                {analysis.riskScore}
                <span className="text-sm text-[#718C85]">/100</span>
              </span>
              <span className="text-[10px] text-[#718C85] font-mono">
                Heuristic: {analysis.heuristicScore}
              </span>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                className="w-full justify-center border-[#28504A] text-[#A0B8B2] hover:text-[#E7F4F1]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF Report
              </Button>
              {userRole !== "VIEWER" && (
                createdIncident ? (
                  <Button
                    variant="cyan"
                    size="sm"
                    onClick={() => router.push(`/incidents/${createdIncident.id}`)}
                    className="w-full justify-center font-semibold shadow-[0_0_15px_rgba(0,220,194,0.15)] text-[#062321] animate-in fade-in"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-[#062321]" />
                    View Active Case
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    variant="cyan"
                    size="sm"
                    onClick={() => {
                      setIncidentError(null);
                      setIsIncidentModalOpen(true);
                    }}
                    className="w-full justify-center font-semibold shadow-[0_0_15px_rgba(0,220,194,0.15)]"
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Open Incident Case
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: Lexical Characteristics & Brand Protection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Structural URL Characteristics */}
        <Card>
          <CardHeader
            title="Lexical & Structural Characteristics"
            description="Normalized URL parameters and domain structure attributes"
            icon={Globe}
          />
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#193E39]">
              <span className="text-[#A0B8B2]">Apex / Registrable Domain:</span>
              <span className="text-[#E7F4F1] font-semibold">{analysis.registrableDomain || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#193E39]">
              <span className="text-[#A0B8B2]">Hostname:</span>
              <span className="text-[#E7F4F1]">{analysis.normalizedHostname || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#193E39]">
              <span className="text-[#A0B8B2]">Intelligence Status:</span>
              <span className="text-[#00DCC2]">{analysis.intelligenceStatus}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#A0B8B2]">Analysis Mode:</span>
              <span className="text-[#45D6A0]">SSRF-Safe Offline Parsing</span>
            </div>
          </div>
        </Card>

        {/* Brand Protection & Lookalike Matches */}
        <Card>
          <CardHeader
            title="Brand Impersonation & Typosquatting"
            description="Correlation against registered corporate brand assets"
            icon={Layers}
          />
          {(!analysis.brandSimilarities || analysis.brandSimilarities.length === 0) ? (
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg bg-[#031C1B] border border-[#193E39]">
              <ShieldCheck className="h-8 w-8 text-[#45D6A0] mb-2" />
              <p className="text-xs font-semibold text-[#E7F4F1]">No Brand Impersonation Detected</p>
              <p className="text-[11px] text-[#718C85] mt-1">
                Domain does not exhibit homoglyphs or keywords targeting registered brand assets.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analysis.brandSimilarities.map((b: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg border border-[#FFB454]/30 bg-[#FFB454]/10 p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-[#FFB454]">
                    <span>Target Brand: {b.brandName}</span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#FFB454]/20 border border-[#FFB454]/40">
                      {b.matchType}
                    </span>
                  </div>
                  <p className="text-[#A0B8B2] mt-1.5">{b.details}</p>
                  <p className="text-[11px] font-mono text-[#718C85] mt-1">
                    Official Domain: {b.officialDomain} (Similarity: {Math.round((b.similarityScore || 0) * 100)}%)
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* WHOIS & DNS Infrastructure Intelligence */}
      {(analysis.whoisDns || analysis.report?.whoisDns) && (
        <WhoisPanel
          whoisDns={analysis.whoisDns || analysis.report?.whoisDns}
          registrableDomain={analysis.registrableDomain}
        />
      )}

      {/* Detected Heuristic Signals Table */}
      <Card>
        <CardHeader
          title="Evidence-Based Heuristic Signals"
          description="Transparent rule-based scoring contributions with contextual evidence"
          icon={ShieldAlert}
        />
        {(!analysis.signals || analysis.signals.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg bg-[#031C1B] border border-[#193E39]">
            <ShieldCheck className="h-8 w-8 text-[#00DCC2] mb-2" />
            <p className="text-xs font-semibold text-[#E7F4F1]">No Malicious Heuristics Flagged</p>
            <p className="text-[11px] text-[#718C85] mt-1">
              Asset adheres to normal structural and lexical standards.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {analysis.signals.map((sig: any, idx: number) => (
              <div
                key={idx}
                className="rounded-lg border border-[#193E39] bg-[#031C1B] p-3.5 text-xs hover:border-[#28504A] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#E7F4F1]">{sig.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0B302D] text-[#A0B8B2] font-mono border border-[#193E39]">
                      {sig.category}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#FF6474] bg-[#FF6474]/15 border border-[#FF6474]/30 px-2 py-0.5 rounded">
                    +{sig.weight} pts
                  </span>
                </div>
                <p className="text-[#A0B8B2] mt-1.5">{sig.description}</p>
                <div className="mt-2 rounded bg-[#082E2B] p-2 border border-[#193E39] font-mono text-[11px] text-[#00DCC2]">
                  <span className="text-[#718C85]">Evidence: </span>
                  {sig.evidence}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* AI Threat Explanation & Defensive Recommendations */}
      <Card glow="cyan">
        <CardHeader
          title="Threat Explanation & Defensive Recommendations"
          description="Evidence synthesis, why indicators matter, and proportional mitigation steps"
          icon={Sparkles}
        />
        <div className="space-y-4 text-xs">
          <div className="rounded-lg bg-[#0B302D] border border-[#28504A] p-4">
            <h4 className="font-semibold text-[#00DCC2] mb-1">Executive Threat Summary</h4>
            <p className="text-[#E7F4F1] leading-relaxed">
              {analysis.aiExplanation || "Automated threat evaluation completed."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-[#031C1B] border border-[#193E39] p-4">
              <h4 className="font-semibold text-[#FFB454] mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Uncertainty & Evaluation Notes</span>
              </h4>
              <p className="text-[#A0B8B2] leading-relaxed">
                Heuristic scores evaluate structural and brand patterns. A high heuristic score indicates elevated suspiciousness but does not constitute definitive proof of malicious activity without sandbox telemetry.
              </p>
            </div>

            <div className="rounded-lg bg-[#031C1B] border border-[#193E39] p-4">
              <h4 className="font-semibold text-[#45D6A0] mb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Recommended Defensive Actions</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[#A0B8B2]">
                <li>Enforce DNS blocking on corporate resolvers for high-risk assets.</li>
                <li>Submit takedown request to the domain registrar if brand impersonation is confirmed.</li>
                <li>Inspect email gateway logs for incoming lures matching this host.</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Analysis Limitations Disclaimer */}
      <div className="rounded-xl border border-[#193E39] bg-[#031C1B] p-4 text-xs text-[#A0B8B2] flex items-start gap-3">
        <Info className="h-5 w-5 text-[#718C85] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#E7F4F1]">Analysis Methodology & Limitations</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#718C85]">
            {limitationsList.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal: Open Incident Case */}
      <Modal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        title="Open SOC Incident Investigation Case"
        description="Escalate this threat analysis into an active security operations case for triage, evidence gathering, and remediation tracking."
      >
        <form onSubmit={handleCreateIncident} className="space-y-4">
          {/* Target Context Summary Banner */}
          <div className="p-3 rounded-xl border border-[#28504A] bg-[#031C1B] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[#A0B8B2] block text-[10px]">Target Asset:</span>
              <span className="text-[#00DCC2] font-bold truncate max-w-[220px] block">
                {analysis.normalizedHostname || analysis.submittedUrl}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#A0B8B2] block text-[10px]">Risk Score:</span>
              <span className="text-[#FF6474] font-bold">
                {analysis.riskScore}/100 ({analysis.severity})
              </span>
            </div>
          </div>

          {/* Severity Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#A0B8B2] mb-1.5">
              Case Severity & Priority
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSelectedSeverity(sev)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                    selectedSeverity === sev
                      ? sev === "CRITICAL"
                        ? "bg-[#FF6474]/20 border-[#FF6474] text-[#FF6474] shadow-[0_0_8px_rgba(255,100,116,0.4)]"
                        : sev === "HIGH"
                        ? "bg-[#FFB454]/20 border-[#FFB454] text-[#FFB454] shadow-[0_0_8px_rgba(255,180,84,0.4)]"
                        : sev === "MEDIUM"
                        ? "bg-[#F0D66B]/20 border-[#F0D66B] text-[#F0D66B] shadow-[0_0_8px_rgba(240,214,107,0.4)]"
                        : sev === "LOW"
                        ? "bg-[#45D6A0]/20 border-[#45D6A0] text-[#45D6A0] shadow-[0_0_8px_rgba(69,214,160,0.4)]"
                        : "bg-[#00DCC2]/20 border-[#00DCC2] text-[#00DCC2]"
                      : "bg-[#031C1B] border-[#193E39] text-[#718C85] hover:border-[#28504A]"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A0B8B2] mb-1.5">
              Incident Case Title
            </label>
            <input
              type="text"
              value={incidentTitle}
              onChange={(e) => setIncidentTitle(e.target.value)}
              required
              placeholder="e.g. Suspicious Domain Impersonation..."
              className="w-full rounded-lg border border-[#28504A] bg-[#031C1B] px-3.5 py-2 text-xs text-[#E7F4F1] focus:border-[#00DCC2] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A0B8B2] mb-1.5">
              Description & Initial Triage Assessment
            </label>
            <textarea
              rows={4}
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              required
              className="w-full rounded-lg border border-[#28504A] bg-[#031C1B] px-3.5 py-2 text-xs text-[#E7F4F1] focus:border-[#00DCC2] focus:outline-none"
            />
          </div>

          {incidentError && (
            <div className="rounded-lg bg-[#FF6474]/15 border border-[#FF6474]/40 p-3 text-xs text-[#FF6474] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF6474]" />
              <span>{incidentError}</span>
            </div>
          )}

          {incidentSuccessMsg && (
            <div className="rounded-xl bg-[#45D6A0]/15 border border-[#45D6A0]/40 p-3.5 text-xs text-[#45D6A0] space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-[#45D6A0] shrink-0" />
                <span>{incidentSuccessMsg}</span>
              </div>
              {createdIncident && (
                <div className="flex items-center justify-between pt-2 border-t border-[#45D6A0]/30">
                  <span className="font-mono text-[11px] text-[#45D6A0]">
                    Case #{createdIncident.id.slice(-6).toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => router.push(`/incidents/${createdIncident.id}`)}
                    className="flex items-center gap-1 font-semibold text-[#062321] bg-[#45D6A0] hover:bg-[#45D6A0]/90 px-2.5 py-1 rounded text-[11px] transition-colors"
                  >
                    Open Investigation Workspace Now
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-[#193E39]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsIncidentModalOpen(false)}
              className="border-[#28504A] text-[#A0B8B2]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cyan"
              size="sm"
              isLoading={isSubmittingIncident}
              className="font-semibold"
            >
              <FolderPlus className="h-3.5 w-3.5 mr-1.5" />
              Open Incident Case
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
