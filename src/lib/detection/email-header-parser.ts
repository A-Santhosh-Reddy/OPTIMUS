/**
 * Email Header Parser & Phishing Detection Engine
 * Parses raw email headers and detects spoofing, failed authentication,
 * suspicious relay hops, and embedded malicious URLs.
 */

export interface EmailHeaderAnalysisResult {
  // Sender information
  sender: {
    from: string | null;
    replyTo: string | null;
    returnPath: string | null;
    envelopeFrom: string | null;
    isSpoofed: boolean;
    spoofDetails: string | null;
  };
  // Authentication results
  authentication: {
    spf: AuthCheckResult;
    dkim: AuthCheckResult;
    dmarc: AuthCheckResult;
    overallVerdict: "PASS" | "PARTIAL" | "FAIL" | "NONE";
  };
  // Relay hop analysis
  relayHops: RelayHop[];
  relayAnalysis: {
    totalHops: number;
    suspiciousHops: string[];
    geographicAnomalies: string[];
    internalToExternalBoundary: string | null;
  };
  // Extracted URLs from headers
  extractedUrls: string[];
  // Subject and metadata
  subject: string | null;
  messageId: string | null;
  date: string | null;
  // Risk assessment
  riskIndicators: EmailRiskIndicator[];
  overallRisk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAN";
  riskScore: number; // 0-100
}

export interface AuthCheckResult {
  status: "PASS" | "FAIL" | "SOFTFAIL" | "NEUTRAL" | "NONE" | "TEMPERROR" | "PERMERROR";
  details: string;
  domain: string | null;
}

export interface RelayHop {
  index: number;
  from: string;
  by: string;
  timestamp: string | null;
  protocol: string | null;
  isInternal: boolean;
  isSuspicious: boolean;
  suspiciousReason: string | null;
}

export interface EmailRiskIndicator {
  type: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  points: number;
}

/**
 * Extract a specific header value from raw email headers
 */
function extractHeader(headers: string, name: string): string | null {
  // Email headers can span multiple lines (continuation lines start with whitespace)
  const regex = new RegExp(`^${name}:\\s*(.+?)(?=\\r?\\n[^\\s]|$)`, "ims");
  const match = headers.match(regex);
  if (match) {
    // Collapse continuation lines
    return match[1].replace(/\r?\n\s+/g, " ").trim();
  }
  return null;
}

/**
 * Extract all values of a repeating header
 */
function extractAllHeaders(headers: string, name: string): string[] {
  const results: string[] = [];
  const regex = new RegExp(`^${name}:\\s*(.+?)(?=\\r?\\n[^\\s]|$)`, "gims");
  let match;
  while ((match = regex.exec(headers)) !== null) {
    results.push(match[1].replace(/\r?\n\s+/g, " ").trim());
  }
  return results;
}

/**
 * Extract email address from a header value like "Name <email@domain.com>"
 */
function extractEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return match ? match[1].trim() : value.trim();
}

/**
 * Extract domain from email address
 */
function extractDomain(email: string): string | null {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1].toLowerCase() : null;
}

/**
 * Parse SPF authentication result from Authentication-Results header
 */
function parseSPF(authResults: string): AuthCheckResult {
  const result: AuthCheckResult = {
    status: "NONE",
    details: "No SPF record found in Authentication-Results header",
    domain: null,
  };

  // Match spf=pass, spf=fail, spf=softfail, etc.
  const spfMatch = authResults.match(/spf\s*=\s*(pass|fail|softfail|neutral|temperror|permerror|none)/i);
  if (spfMatch) {
    result.status = spfMatch[1].toUpperCase() as AuthCheckResult["status"];
    result.details = `SPF check returned: ${spfMatch[1].toUpperCase()}`;
  }

  // Extract the SPF domain
  const domainMatch = authResults.match(/spf\s*=\s*\S+.*?(?:smtp\.(?:mailfrom|helo)\s*=\s*)([^\s;]+)/i);
  if (domainMatch) {
    result.domain = domainMatch[1].toLowerCase();
  }

  // Check Received-SPF header as fallback
  return result;
}

/**
 * Parse DKIM authentication result
 */
function parseDKIM(authResults: string): AuthCheckResult {
  const result: AuthCheckResult = {
    status: "NONE",
    details: "No DKIM signature found in Authentication-Results header",
    domain: null,
  };

  const dkimMatch = authResults.match(/dkim\s*=\s*(pass|fail|temperror|permerror|neutral|none)/i);
  if (dkimMatch) {
    result.status = dkimMatch[1].toUpperCase() as AuthCheckResult["status"];
    result.details = `DKIM verification returned: ${dkimMatch[1].toUpperCase()}`;
  }

  // Extract signing domain
  const domainMatch = authResults.match(/dkim\s*=\s*\S+.*?(?:header\.[dis]=|d=)([^\s;]+)/i);
  if (domainMatch) {
    result.domain = domainMatch[1].toLowerCase();
  }

  return result;
}

/**
 * Parse DMARC authentication result
 */
function parseDMARC(authResults: string): AuthCheckResult {
  const result: AuthCheckResult = {
    status: "NONE",
    details: "No DMARC policy found in Authentication-Results header",
    domain: null,
  };

  const dmarcMatch = authResults.match(/dmarc\s*=\s*(pass|fail|bestguesspass|temperror|permerror|none)/i);
  if (dmarcMatch) {
    result.status = dmarcMatch[1].toUpperCase() as AuthCheckResult["status"];
    result.details = `DMARC alignment check: ${dmarcMatch[1].toUpperCase()}`;
  }

  // Extract policy domain
  const domainMatch = authResults.match(/dmarc\s*=\s*\S+.*?(?:header\.from\s*=\s*)([^\s;]+)/i);
  if (domainMatch) {
    result.domain = domainMatch[1].toLowerCase();
  }

  return result;
}

/**
 * Parse Received: headers to extract relay hop chain
 */
function parseRelayHops(headers: string): RelayHop[] {
  const receivedHeaders = extractAllHeaders(headers, "Received");
  const hops: RelayHop[] = [];

  // Received headers are in reverse order (most recent first)
  for (let i = 0; i < receivedHeaders.length; i++) {
    const raw = receivedHeaders[i];

    // Extract "from" server
    const fromMatch = raw.match(/from\s+([^\s(]+)/i);
    const from = fromMatch ? fromMatch[1] : "unknown";

    // Extract "by" server
    const byMatch = raw.match(/by\s+([^\s(]+)/i);
    const by = byMatch ? byMatch[1] : "unknown";

    // Extract timestamp
    const timestampMatch = raw.match(/;\s*(.+)$/);
    const timestamp = timestampMatch ? timestampMatch[1].trim() : null;

    // Extract protocol
    const protoMatch = raw.match(/with\s+(E?SMTP[AS]?|HTTPS?|LMTP)/i);
    const protocol = protoMatch ? protoMatch[1].toUpperCase() : null;

    // Determine if internal hop (common internal patterns)
    const isInternal =
      from.includes("localhost") ||
      from.includes("127.0.0.1") ||
      from.includes("internal") ||
      from.includes(".local") ||
      by.includes("localhost") ||
      by.includes("internal");

    // Determine if suspicious
    let isSuspicious = false;
    let suspiciousReason: string | null = null;

    // Check for IP address hops (instead of named hosts)
    const ipFromMatch = from.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
    if (ipFromMatch && !isInternal) {
      // Direct IP relay is suspicious for external hops
      isSuspicious = true;
      suspiciousReason = `External relay from raw IP address: ${ipFromMatch[0]}`;
    }

    hops.push({
      index: receivedHeaders.length - i, // Reverse to chronological order
      from,
      by,
      timestamp,
      protocol,
      isInternal,
      isSuspicious,
      suspiciousReason,
    });
  }

  // Reverse to chronological order
  return hops.reverse();
}

/**
 * Extract URLs from email headers (common in List-Unsubscribe, etc.)
 */
function extractUrlsFromHeaders(headers: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"')\]]+/gi;
  const matches = headers.match(urlRegex) || [];
  return Array.from(new Set(matches)); // Deduplicate
}

/**
 * Main Email Header Analysis function
 */
export function analyzeEmailHeaders(rawHeaders: string): EmailHeaderAnalysisResult {
  const riskIndicators: EmailRiskIndicator[] = [];
  let riskScore = 0;

  // Extract key headers
  const from = extractHeader(rawHeaders, "From");
  const replyTo = extractHeader(rawHeaders, "Reply-To");
  const returnPath = extractHeader(rawHeaders, "Return-Path");
  const envelopeFrom = extractHeader(rawHeaders, "X-Envelope-From") || extractHeader(rawHeaders, "Envelope-From");
  const subject = extractHeader(rawHeaders, "Subject");
  const messageId = extractHeader(rawHeaders, "Message-ID") || extractHeader(rawHeaders, "Message-Id");
  const date = extractHeader(rawHeaders, "Date");

  // Get Authentication-Results header(s)
  const authResultsHeaders = extractAllHeaders(rawHeaders, "Authentication-Results");
  const combinedAuthResults = authResultsHeaders.join(" ");

  // Also check Received-SPF header
  const receivedSpf = extractHeader(rawHeaders, "Received-SPF");

  // Parse authentication
  const spf = parseSPF(combinedAuthResults + (receivedSpf ? ` spf=${receivedSpf}` : ""));
  const dkim = parseDKIM(combinedAuthResults);
  const dmarc = parseDMARC(combinedAuthResults);

  // If Received-SPF exists, use it as additional data
  if (receivedSpf) {
    const spfStatusMatch = receivedSpf.match(/^(pass|fail|softfail|neutral|temperror|permerror|none)/i);
    if (spfStatusMatch && spf.status === "NONE") {
      spf.status = spfStatusMatch[1].toUpperCase() as AuthCheckResult["status"];
      spf.details = `SPF via Received-SPF: ${spfStatusMatch[1].toUpperCase()}`;
    }
  }

  // Overall authentication verdict
  const authStatuses = [spf.status, dkim.status, dmarc.status];
  const passCount = authStatuses.filter((s) => s === "PASS").length;
  const failCount = authStatuses.filter((s) => ["FAIL", "SOFTFAIL", "PERMERROR"].includes(s)).length;

  let overallVerdict: "PASS" | "PARTIAL" | "FAIL" | "NONE";
  if (passCount === 3) {
    overallVerdict = "PASS";
  } else if (failCount > 0) {
    overallVerdict = passCount > 0 ? "PARTIAL" : "FAIL";
  } else if (passCount > 0) {
    overallVerdict = "PARTIAL";
  } else {
    overallVerdict = "NONE";
  }

  // Sender spoofing detection
  const fromEmail = from ? extractEmailAddress(from) : null;
  const replyToEmail = replyTo ? extractEmailAddress(replyTo) : null;
  const returnPathEmail = returnPath ? extractEmailAddress(returnPath) : null;

  const fromDomain = fromEmail ? extractDomain(fromEmail) : null;
  const replyToDomain = replyToEmail ? extractDomain(replyToEmail) : null;
  const returnPathDomain = returnPathEmail ? extractDomain(returnPathEmail) : null;

  let isSpoofed = false;
  let spoofDetails: string | null = null;

  // Check From vs Reply-To mismatch
  if (fromDomain && replyToDomain && fromDomain !== replyToDomain) {
    isSpoofed = true;
    spoofDetails = `From domain (${fromDomain}) doesn't match Reply-To domain (${replyToDomain})`;
    riskIndicators.push({
      type: "SENDER_DOMAIN_MISMATCH",
      title: "From / Reply-To Domain Mismatch",
      description: `The From header claims domain "${fromDomain}" but Reply-To points to "${replyToDomain}". This is a strong indicator of sender spoofing.`,
      severity: "HIGH",
      points: 30,
    });
    riskScore += 30;
  }

  // Check From vs Return-Path mismatch
  if (fromDomain && returnPathDomain && fromDomain !== returnPathDomain) {
    if (!isSpoofed) {
      isSpoofed = true;
      spoofDetails = `From domain (${fromDomain}) doesn't match Return-Path domain (${returnPathDomain})`;
    }
    riskIndicators.push({
      type: "RETURN_PATH_MISMATCH",
      title: "From / Return-Path Domain Mismatch",
      description: `Envelope Return-Path domain "${returnPathDomain}" differs from the visible From domain "${fromDomain}". May indicate forwarding or spoofing.`,
      severity: "MEDIUM",
      points: 15,
    });
    riskScore += 15;
  }

  // Authentication failure risk indicators
  if (spf.status === "FAIL" || spf.status === "PERMERROR") {
    riskIndicators.push({
      type: "SPF_FAIL",
      title: "SPF Authentication Failed",
      description: `The sending server is NOT authorized to send email on behalf of this domain. SPF result: ${spf.status}`,
      severity: "CRITICAL",
      points: 30,
    });
    riskScore += 30;
  } else if (spf.status === "SOFTFAIL") {
    riskIndicators.push({
      type: "SPF_SOFTFAIL",
      title: "SPF Soft Failure",
      description: "The sending server is not explicitly authorized (soft fail). The domain's SPF policy does not definitively reject this sender.",
      severity: "MEDIUM",
      points: 15,
    });
    riskScore += 15;
  }

  if (dkim.status === "FAIL" || dkim.status === "PERMERROR") {
    riskIndicators.push({
      type: "DKIM_FAIL",
      title: "DKIM Signature Verification Failed",
      description: "The email's cryptographic DKIM signature is invalid or missing. The message may have been modified in transit.",
      severity: "HIGH",
      points: 25,
    });
    riskScore += 25;
  }

  if (dmarc.status === "FAIL") {
    riskIndicators.push({
      type: "DMARC_FAIL",
      title: "DMARC Policy Alignment Failed",
      description: "Neither SPF nor DKIM passed with alignment to the From domain. The sending domain's DMARC policy recommends rejecting this message.",
      severity: "CRITICAL",
      points: 30,
    });
    riskScore += 30;
  }

  if (overallVerdict === "NONE") {
    riskIndicators.push({
      type: "NO_AUTH_RECORDS",
      title: "No Email Authentication Configured",
      description: "No SPF, DKIM, or DMARC records were found. The sender domain has no email authentication, making it trivially spoofable.",
      severity: "HIGH",
      points: 20,
    });
    riskScore += 20;
  }

  // Parse relay hops
  const relayHops = parseRelayHops(rawHeaders);
  const suspiciousHops = relayHops
    .filter((h) => h.isSuspicious)
    .map((h) => `Hop ${h.index}: ${h.suspiciousReason}`);

  if (suspiciousHops.length > 0) {
    riskIndicators.push({
      type: "SUSPICIOUS_RELAY",
      title: "Suspicious Email Relay Detected",
      description: `${suspiciousHops.length} relay hop(s) exhibit suspicious characteristics: ${suspiciousHops[0]}`,
      severity: "MEDIUM",
      points: 10,
    });
    riskScore += 10;
  }

  // Excessive relay hops (unusual for legitimate email)
  if (relayHops.length > 8) {
    riskIndicators.push({
      type: "EXCESSIVE_RELAY_HOPS",
      title: "Excessive Email Relay Chain",
      description: `Email passed through ${relayHops.length} relay hops. Legitimate emails typically have 3-5 hops. Excessive hops may indicate relay laundering or open relay abuse.`,
      severity: "LOW",
      points: 5,
    });
    riskScore += 5;
  }

  // Extract URLs from headers
  const extractedUrls = extractUrlsFromHeaders(rawHeaders);

  // Cap risk score at 100
  riskScore = Math.min(100, riskScore);

  // Determine overall risk level
  let overallRisk: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAN";
  if (riskScore >= 70) {
    overallRisk = "CRITICAL";
  } else if (riskScore >= 40) {
    overallRisk = "HIGH";
  } else if (riskScore >= 20) {
    overallRisk = "MEDIUM";
  } else if (riskScore > 0) {
    overallRisk = "LOW";
  } else {
    overallRisk = "CLEAN";
  }

  return {
    sender: {
      from: fromEmail,
      replyTo: replyToEmail,
      returnPath: returnPathEmail,
      envelopeFrom: envelopeFrom ? extractEmailAddress(envelopeFrom) : null,
      isSpoofed,
      spoofDetails,
    },
    authentication: {
      spf,
      dkim,
      dmarc,
      overallVerdict,
    },
    relayHops,
    relayAnalysis: {
      totalHops: relayHops.length,
      suspiciousHops,
      geographicAnomalies: [],
      internalToExternalBoundary: null,
    },
    extractedUrls,
    subject,
    messageId,
    date,
    riskIndicators,
    overallRisk,
    riskScore,
  };
}
