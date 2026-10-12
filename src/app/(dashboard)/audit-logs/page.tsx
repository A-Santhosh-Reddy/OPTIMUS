"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  ShieldAlert,
  User,
  Clock,
  Filter,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuditLogsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/audit-events");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load audit logs");
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E7F4F1] flex items-center gap-2">
          Security Audit Event Logs
        </h1>
        <p className="text-xs text-[#A0B8B2] mt-1">
          Immutable audit trail recording authentication, threat analysis requests, incident status changes, and brand asset modifications.
        </p>
      </div>

      <Card>
        <CardHeader
          title={`Security Audit Log Events (${events.length})`}
          description="Chronological security telemetry recorded for compliance and SOC accountability"
          icon={History}
        />

        {error ? (
          <div className="p-6 text-center text-xs text-[#FF6474]">
            <Lock className="h-6 w-6 mx-auto mb-2 opacity-60" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-[#0B302D]/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#718C85]">
            No audit log events recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[#193E39] bg-[#042422] text-[#A0B8B2]">
                <tr>
                  <th className="py-3 pl-3">Timestamp</th>
                  <th className="py-3">Actor / Analyst</th>
                  <th className="py-3">Action</th>
                  <th className="py-3">Resource</th>
                  <th className="py-3">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#193E39] text-[#E7F4F1]">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#163632]/50 transition-colors">
                    <td className="py-3 pl-3 text-[#A0B8B2] text-[11px]">
                      {new Date(evt.timestamp).toLocaleDateString()} {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 font-semibold text-[#E7F4F1]">
                      {evt.actorEmail}
                    </td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.5 rounded bg-[#00DCC2]/10 border border-[#00DCC2]/30 text-[#00DCC2] text-[10px]">
                        {evt.action}
                      </span>
                    </td>
                    <td className="py-3 text-[#A0B8B2]">
                      {evt.resourceType} {evt.resourceId ? `(${evt.resourceId.substring(0, 8)}...)` : ""}
                    </td>
                    <td className="py-3 text-[#A0B8B2] text-[11px] truncate max-w-xs">
                      {evt.metadata || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
