export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Optimus DRP Platform",
  tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "Digital Risk Protection & Threat Intelligence Platform",
  version: "1.0.0",
  description: "Enterprise defensive intelligence platform for automated suspicious URL analysis, brand impersonation detection, explainable risk scoring, and security incident tracking.",
};

export const ROLES = {
  ADMIN: "ADMIN",
  ANALYST: "ANALYST",
  VIEWER: "VIEWER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const SEVERITIES = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  INFO: "INFO",
} as const;

export type Severity = (typeof SEVERITIES)[keyof typeof SEVERITIES];

export const INCIDENT_STATUSES = {
  NEW: "NEW",
  INVESTIGATING: "INVESTIGATING",
  ESCALATED: "ESCALATED",
  RESOLVED: "RESOLVED",
  FALSE_POSITIVE: "FALSE_POSITIVE",
} as const;

export type IncidentStatus = (typeof INCIDENT_STATUSES)[keyof typeof INCIDENT_STATUSES];

export const INTEL_STATUSES = {
  MATCH_FOUND: "MATCH_FOUND",
  NO_MATCH: "NO_MATCH",
  INCONCLUSIVE: "INCONCLUSIVE",
  UNAVAILABLE: "UNAVAILABLE",
  NOT_CONFIGURED: "NOT_CONFIGURED",
} as const;

export type IntelStatus = (typeof INTEL_STATUSES)[keyof typeof INTEL_STATUSES];
