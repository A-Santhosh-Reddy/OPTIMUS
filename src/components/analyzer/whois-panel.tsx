"use client";

import React from "react";
import {
  Globe,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  Server,
  Mail,
  AlertTriangle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { WhoisDnsResult } from "@/lib/detection/whois-dns";

interface WhoisPanelProps {
  whoisDns: WhoisDnsResult | null | undefined;
  registrableDomain?: string;
}

export function WhoisPanel({ whoisDns, registrableDomain }: WhoisPanelProps) {
  if (!whoisDns || whoisDns.lookupStatus === "SKIPPED") {
    return null;
  }

  const { domainAge, registrar, nameservers, dnsRecords, riskIndicators, latencyMs } = whoisDns;

  return (
    <Card className="border-[#28504A] bg-[#112624]">
      <CardHeader
        title="WHOIS Registration & DNS Infrastructure Intelligence"
        description={`Domain telemetry queried via RDAP & DNS-over-HTTPS (${latencyMs}ms)`}
        icon={Globe}
        action={
          domainAge.isNewlyRegistered ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF6474]/15 text-[#FF6474] border border-[#FF6474]/30 font-bold">
              NEWLY REGISTERED (&lt;30d)
            </span>
          ) : domainAge.isRecentlyRegistered ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FFB454]/15 text-[#FFB454] border border-[#FFB454]/30 font-bold">
              RECENTLY REGISTERED (&lt;90d)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#45D6A0]/15 text-[#45D6A0] border border-[#45D6A0]/30 font-bold">
              MATURE DOMAIN
            </span>
          )
        }
      />

      {/* Risk Indicators Banner if any */}
      {riskIndicators && riskIndicators.length > 0 && (
        <div className="space-y-2 mb-4">
          {riskIndicators.map((risk, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs ${
                risk.severity === "HIGH"
                  ? "bg-[#FF6474]/15 border-[#FF6474]/30 text-[#FF6474]"
                  : "bg-[#FFB454]/15 border-[#FFB454]/30 text-[#FFB454]"
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[#FFB454]" />
              <div>
                <p className="font-semibold">{risk.title}</p>
                <p className="text-[11px] opacity-80 mt-0.5">{risk.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Domain Age & Timestamps */}
        <div className="p-3.5 rounded-xl bg-[#0B302D] border border-[#193E39] space-y-2">
          <div className="flex items-center gap-2 text-[#00DCC2] font-sans font-semibold border-b border-[#193E39] pb-1.5">
            <Clock className="h-4 w-4" />
            <span>Registration Lifespan</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#193E39]/60">
            <span className="text-[#A0B8B2] font-sans">Domain Age:</span>
            <span className={`font-bold ${domainAge.isNewlyRegistered ? "text-[#FF6474]" : domainAge.isRecentlyRegistered ? "text-[#FFB454]" : "text-[#45D6A0]"}`}>
              {domainAge.ageDays !== null ? `${domainAge.ageDays} days` : "Unknown / Private"}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#193E39]/60">
            <span className="text-[#A0B8B2] font-sans">Created Date:</span>
            <span className="text-[#E7F4F1]">
              {domainAge.registrationDate
                ? new Date(domainAge.registrationDate).toLocaleDateString()
                : "Not Disclosed"}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#193E39]/60">
            <span className="text-[#A0B8B2] font-sans">Expiration Date:</span>
            <span className="text-[#E7F4F1]">
              {domainAge.expirationDate
                ? new Date(domainAge.expirationDate).toLocaleDateString()
                : "Not Disclosed"}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[#A0B8B2] font-sans">Registrar:</span>
            <span className="text-[#00DCC2] truncate max-w-[200px]" title={registrar.name || "N/A"}>
              {registrar.name || "Redacted / Privacy Shield"}
            </span>
          </div>
        </div>

        {/* DNS Infrastructure */}
        <div className="p-3.5 rounded-xl bg-[#0B302D] border border-[#193E39] space-y-2">
          <div className="flex items-center gap-2 text-[#00DCC2] font-sans font-semibold border-b border-[#193E39] pb-1.5">
            <Server className="h-4 w-4" />
            <span>Resolved DNS Records</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#193E39]/60">
            <span className="text-[#A0B8B2] font-sans">A Records (IPv4):</span>
            <span className="text-[#E7F4F1] truncate max-w-[200px]">
              {dnsRecords.a.length > 0 ? dnsRecords.a.join(", ") : "None"}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#193E39]/60">
            <span className="text-[#A0B8B2] font-sans">MX Records:</span>
            <span className="text-[#E7F4F1] truncate max-w-[200px]">
              {dnsRecords.mx.length > 0 ? dnsRecords.mx.slice(0, 2).join(", ") : "None"}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[#193E39]/60">
            <span className="text-[#A0B8B2] font-sans">Nameservers:</span>
            <span className="text-[#E7F4F1] truncate max-w-[200px]">
              {nameservers.length > 0 ? nameservers.slice(0, 2).join(", ") : "None"}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[#A0B8B2] font-sans">Abuse Contact:</span>
            <span className="text-[#A0B8B2] truncate max-w-[200px]" title={registrar.abuseContact || "N/A"}>
              {registrar.abuseContact || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
