"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { AlertConfig } from "@/lib/alerts/alert-engine";

export default function AlertsConfigPage() {
  const [configs, setConfigs] = useState<AlertConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState<"SLACK" | "WEBHOOK" | "EMAIL">("SLACK");
  const [endpoint, setEndpoint] = useState("");
  const [minSeverity, setMinSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("CRITICAL");
  const [formError, setFormError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/alerts/config");
      const data = await res.json();
      if (res.ok && data.configs) {
        setConfigs(data.configs);
      }
    } catch (e) {
      console.error("Failed to load alert configs", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleCreateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !endpoint.trim()) {
      setFormError("Rule name and destination endpoint are required.");
      return;
    }

    try {
      const res = await fetch("/api/alerts/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          endpoint: endpoint.trim(),
          minSeverity,
          isActive: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save alert rule");
      }

      setIsModalOpen(false);
      setName("");
      setEndpoint("");
      fetchConfigs();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDeleteConfig = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/config?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConfigs((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleTestAlert = async (targetSeverity: string = "CRITICAL") => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/alerts/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TEST_ALERT",
          minSeverity: targetSeverity,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              SOC AUTOMATION & NOTIFICATIONS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
            Real-Time Threat Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Configure instant outbound notifications to Slack channels, SOC webhook endpoints, or email distribution lists
            whenever threat severity exceeds your security criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTestAlert()}
            disabled={isTesting}
            className="text-xs font-mono border-cyan-500/30 text-cyan-300"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            {isTesting ? "Dispatching..." : "Send Test Alert"}
          </Button>

          <Button
            variant="cyan"
            size="sm"
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="text-xs font-semibold"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Alert Rule
          </Button>
        </div>
      </div>

      {/* Test Notification Feedback */}
      {testResult && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono animate-in fade-in ${
            testResult.success
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/40 border-red-500/40 text-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span className="font-bold">
              {testResult.success
                ? `Test alert executed successfully! Dispatched to ${
                    testResult.testDelivery?.length || 0
                  } active notification channel(s).`
                : "Test dispatch failed."}
            </span>
          </div>
          {testResult.testDelivery && testResult.testDelivery.length > 0 && (
            <div className="mt-2 pl-6 space-y-1 text-[11px] opacity-80">
              {testResult.testDelivery.map((d: any, idx: number) => (
                <div key={idx}>
                  &bull; {d.configName} ({d.type}): {d.status} {d.responseCode ? `[HTTP ${d.responseCode}]` : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Alert Rule Cards */}
      <Card>
        <CardHeader
          title="Active Notification Channels"
          description={`Configured endpoints for automated threat escalation (${configs.length} active)`}
          icon={Bell}
        />

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            Loading notification endpoints...
          </div>
        ) : configs.length === 0 ? (
          <div className="p-10 text-center rounded-xl bg-slate-950/50 border border-white/5 space-y-3">
            <Radio className="h-8 w-8 text-cyan-400 mx-auto opacity-70" />
            <h4 className="text-sm font-semibold text-slate-200 font-mono">No Alert Rules Configured</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Add a Slack webhook or HTTPS endpoint to receive immediate incident warnings when critical brand impersonations are identified.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-mono mt-2"
            >
              Configure First Rule
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.08]">
            {configs.map((rule) => (
              <div
                key={rule.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-sm text-slate-100">{rule.name}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {rule.type}
                    </span>
                    <SeverityBadge severity={rule.minSeverity} />
                  </div>
                  <p className="text-xs font-mono text-slate-400 truncate max-w-md" title={rule.endpoint}>
                    Destination: <span className="text-slate-300">{rule.endpoint}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Active
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteConfig(rule.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Delete rule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Alert Rule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="CONFIGURE REAL-TIME ALERT RULE"
        description="Establish an automated notification bridge for elevated threat events."
        maxWidth="md"
      >
        <form onSubmit={handleCreateConfig} className="space-y-4 pt-1 text-slate-200 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Rule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., SOC Incident Response Slack Channel"
              className="w-full liquid-glass-input rounded-xl p-2.5 text-xs font-sans text-slate-100 bg-slate-950 border border-white/10 focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Channel Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full liquid-glass-input rounded-xl p-2.5 text-xs font-mono text-cyan-300 bg-slate-950 border border-white/10"
              >
                <option value="SLACK">Slack Incoming Webhook</option>
                <option value="WEBHOOK">Generic JSON Webhook</option>
                <option value="EMAIL">Email Recipient</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Minimum Severity Trigger
              </label>
              <select
                value={minSeverity}
                onChange={(e) => setMinSeverity(e.target.value as any)}
                className="w-full liquid-glass-input rounded-xl p-2.5 text-xs font-mono text-cyan-300 bg-slate-950 border border-white/10"
              >
                <option value="CRITICAL">Critical Only (Score &gt;= 70)</option>
                <option value="HIGH">High & Critical (Score &gt;= 40)</option>
                <option value="MEDIUM">Medium & Above (Score &gt;= 20)</option>
                <option value="LOW">All Detections</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Destination Endpoint URL or Email
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder={
                type === "SLACK"
                  ? "https://hooks.slack.com/services/T00/B00/XXXX"
                  : type === "EMAIL"
                  ? "soc-team@company.com"
                  : "https://siem.corp.internal/webhook/optimus"
              }
              className="w-full liquid-glass-input rounded-xl p-2.5 text-xs font-mono text-slate-100 bg-slate-950 border border-white/10 focus:border-cyan-400"
            />
          </div>

          {formError && (
            <p className="text-red-400 text-[11px] font-mono bg-red-950/60 p-2 rounded-lg border border-red-500/30">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" variant="cyan" size="sm" className="text-xs font-semibold">
              Save Alert Rule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
