/**
 * WHOIS & DNS Intelligence Lookup Engine
 * Enriches URL analysis with domain registration data and DNS record inspection.
 * Uses public RDAP (Registration Data Access Protocol) and DNS-over-HTTPS APIs.
 * 
 * SSRF-Safe: Only contacts well-known, trusted public APIs (RDAP, Cloudflare DoH).
 */

export interface WhoisDnsResult {
  domainAge: {
    registrationDate: string | null;
    expirationDate: string | null;
    updatedDate: string | null;
    ageDays: number | null;
    isNewlyRegistered: boolean; // < 30 days
    isRecentlyRegistered: boolean; // < 90 days
  };
  registrar: {
    name: string | null;
    abuseContact: string | null;
    url: string | null;
  };
  nameservers: string[];
  dnsRecords: {
    a: string[];
    aaaa: string[];
    mx: string[];
    txt: string[];
    cname: string[];
    ns: string[];
  };
  riskIndicators: WhoisRiskIndicator[];
  lookupStatus: "SUCCESS" | "PARTIAL" | "FAILED" | "SKIPPED";
  errorDetails?: string;
  lookupTimestamp: string;
  latencyMs: number;
}

export interface WhoisRiskIndicator {
  type: string;
  title: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

// Well-known free / bulletproof hosting nameserver patterns
const SUSPICIOUS_NS_PATTERNS = [
  "bulletproof",
  "offshore",
  "freenom",
  "afraid.org",
  "changeip",
  "duckdns",
  "no-ip",
  "dynu",
  "zapto",
];

// Disposable email service MX patterns
const DISPOSABLE_MX_PATTERNS = [
  "mailinator",
  "guerrillamail",
  "tempmail",
  "throwaway",
  "maildrop",
  "yopmail",
  "dispostable",
  "sharklasers",
  "grr.la",
  "guerrillamailblock",
];

/**
 * Calculate the age of a domain in days from its registration date
 */
function calculateDomainAgeDays(registrationDate: string): number | null {
  try {
    const regDate = new Date(registrationDate);
    if (isNaN(regDate.getTime())) return null;
    const now = new Date();
    const diffMs = now.getTime() - regDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

/**
 * Lookup WHOIS / RDAP data for a registrable domain.
 * Uses the public RDAP bootstrap service (rdap.org) which is the IETF standard successor to WHOIS.
 */
async function lookupRdap(domain: string): Promise<{
  registrationDate: string | null;
  expirationDate: string | null;
  updatedDate: string | null;
  registrarName: string | null;
  registrarUrl: string | null;
  abuseContact: string | null;
  nameservers: string[];
}> {
  const result = {
    registrationDate: null as string | null,
    expirationDate: null as string | null,
    updatedDate: null as string | null,
    registrarName: null as string | null,
    registrarUrl: null as string | null,
    abuseContact: null as string | null,
    nameservers: [] as string[],
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const resp = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      method: "GET",
      headers: { Accept: "application/rdap+json" },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!resp.ok) {
      return result;
    }

    const data = await resp.json();

    // Extract event dates
    if (data.events && Array.isArray(data.events)) {
      for (const event of data.events) {
        if (event.eventAction === "registration") {
          result.registrationDate = event.eventDate || null;
        } else if (event.eventAction === "expiration") {
          result.expirationDate = event.eventDate || null;
        } else if (event.eventAction === "last changed" || event.eventAction === "last update of RDAP database") {
          result.updatedDate = event.eventDate || null;
        }
      }
    }

    // Extract registrar info from entities
    if (data.entities && Array.isArray(data.entities)) {
      for (const entity of data.entities) {
        if (entity.roles && entity.roles.includes("registrar")) {
          // Get registrar name from vcardArray
          if (entity.vcardArray && Array.isArray(entity.vcardArray[1])) {
            for (const vcard of entity.vcardArray[1]) {
              if (vcard[0] === "fn") {
                result.registrarName = vcard[3] || null;
              }
            }
          }
          // Fallback to handle property
          if (!result.registrarName && entity.handle) {
            result.registrarName = entity.handle;
          }
          // Get registrar URL
          if (entity.links && Array.isArray(entity.links)) {
            for (const link of entity.links) {
              if (link.rel === "self" || link.type === "text/html") {
                result.registrarUrl = link.href || null;
                break;
              }
            }
          }
          // Get abuse contact
          if (entity.entities && Array.isArray(entity.entities)) {
            for (const subEntity of entity.entities) {
              if (subEntity.roles && subEntity.roles.includes("abuse")) {
                if (subEntity.vcardArray && Array.isArray(subEntity.vcardArray[1])) {
                  for (const vcard of subEntity.vcardArray[1]) {
                    if (vcard[0] === "email") {
                      result.abuseContact = vcard[3] || null;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // Extract nameservers
    if (data.nameservers && Array.isArray(data.nameservers)) {
      result.nameservers = data.nameservers
        .map((ns: any) => ns.ldhName || ns.unicodeName || "")
        .filter(Boolean)
        .map((ns: string) => ns.toLowerCase());
    }
  } catch (err: any) {
    // RDAP lookup failed silently - we'll return empty result
    console.warn("RDAP lookup failed for", domain, err.message);
  }

  return result;
}

/**
 * Lookup DNS records using Cloudflare's DNS-over-HTTPS API (1.1.1.1).
 * This is a trusted, well-known public resolver.
 */
async function lookupDns(domain: string, recordType: string): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const resp = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${recordType}`,
      {
        method: "GET",
        headers: { Accept: "application/dns-json" },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!resp.ok) return [];

    const data = await resp.json();
    if (data.Answer && Array.isArray(data.Answer)) {
      return data.Answer.map((record: any) => record.data?.replace(/\.$/,"") || "").filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Main WHOIS & DNS Intelligence lookup function.
 * Performs RDAP + DNS lookups and identifies risk indicators.
 */
export async function lookupWhoisDns(
  registrableDomain: string,
  isIpAddress: boolean = false
): Promise<WhoisDnsResult> {
  const startTime = Date.now();

  // Skip for IP addresses - WHOIS/DNS enrichment is for domain names
  if (isIpAddress || !registrableDomain || registrableDomain.length < 3) {
    return {
      domainAge: {
        registrationDate: null,
        expirationDate: null,
        updatedDate: null,
        ageDays: null,
        isNewlyRegistered: false,
        isRecentlyRegistered: false,
      },
      registrar: { name: null, abuseContact: null, url: null },
      nameservers: [],
      dnsRecords: { a: [], aaaa: [], mx: [], txt: [], cname: [], ns: [] },
      riskIndicators: [],
      lookupStatus: "SKIPPED",
      lookupTimestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
    };
  }

  const riskIndicators: WhoisRiskIndicator[] = [];
  let lookupStatus: "SUCCESS" | "PARTIAL" | "FAILED" = "FAILED";

  // Run RDAP and DNS lookups in parallel for performance
  const [rdapResult, aRecords, aaaaRecords, mxRecords, txtRecords, cnameRecords, nsRecords] =
    await Promise.all([
      lookupRdap(registrableDomain),
      lookupDns(registrableDomain, "A"),
      lookupDns(registrableDomain, "AAAA"),
      lookupDns(registrableDomain, "MX"),
      lookupDns(registrableDomain, "TXT"),
      lookupDns(registrableDomain, "CNAME"),
      lookupDns(registrableDomain, "NS"),
    ]);

  // Determine domain age
  const ageDays = rdapResult.registrationDate
    ? calculateDomainAgeDays(rdapResult.registrationDate)
    : null;
  const isNewlyRegistered = ageDays !== null && ageDays < 30;
  const isRecentlyRegistered = ageDays !== null && ageDays < 90;

  // Risk Indicator 1: Newly Registered Domain
  if (isNewlyRegistered) {
    riskIndicators.push({
      type: "NEWLY_REGISTERED_DOMAIN",
      title: "Newly Registered Domain (< 30 days)",
      description: `Domain was registered ${ageDays} days ago. Newly registered domains are 10x more likely to be used in phishing and malware campaigns.`,
      severity: "HIGH",
    });
  } else if (isRecentlyRegistered) {
    riskIndicators.push({
      type: "RECENTLY_REGISTERED_DOMAIN",
      title: "Recently Registered Domain (< 90 days)",
      description: `Domain was registered ${ageDays} days ago. Recently registered domains have elevated risk profiles.`,
      severity: "MEDIUM",
    });
  }

  // Risk Indicator 2: Suspicious Nameservers
  const allNameservers = [...rdapResult.nameservers, ...nsRecords.map((ns) => ns.toLowerCase())];
  const uniqueNameservers = Array.from(new Set(allNameservers));
  const suspiciousNs = uniqueNameservers.filter((ns) =>
    SUSPICIOUS_NS_PATTERNS.some((pattern) => ns.includes(pattern))
  );
  if (suspiciousNs.length > 0) {
    riskIndicators.push({
      type: "SUSPICIOUS_NAMESERVER",
      title: "Suspicious Nameserver Provider",
      description: `Domain uses nameservers associated with dynamic DNS or bulletproof hosting: ${suspiciousNs.join(", ")}`,
      severity: "MEDIUM",
    });
  }

  // Risk Indicator 3: Disposable Email MX Records
  const mxLower = mxRecords.map((mx) => mx.toLowerCase());
  const disposableMx = mxLower.filter((mx) =>
    DISPOSABLE_MX_PATTERNS.some((pattern) => mx.includes(pattern))
  );
  if (disposableMx.length > 0) {
    riskIndicators.push({
      type: "DISPOSABLE_EMAIL_MX",
      title: "Disposable Email Service MX Record",
      description: `Domain's MX records point to disposable email services: ${disposableMx.join(", ")}`,
      severity: "MEDIUM",
    });
  }

  // Risk Indicator 4: No MX records at all (unusual for legitimate businesses)
  if (mxRecords.length === 0 && aRecords.length > 0) {
    riskIndicators.push({
      type: "NO_MX_RECORDS",
      title: "No Email (MX) Records Configured",
      description: "Domain has web hosting (A records) but no email configuration, which is unusual for legitimate business domains.",
      severity: "LOW",
    });
  }

  // Determine lookup status
  const hasRdapData = rdapResult.registrationDate !== null || rdapResult.registrarName !== null;
  const hasDnsData = aRecords.length > 0 || nsRecords.length > 0;

  if (hasRdapData && hasDnsData) {
    lookupStatus = "SUCCESS";
  } else if (hasRdapData || hasDnsData) {
    lookupStatus = "PARTIAL";
  } else {
    lookupStatus = "FAILED";
  }

  return {
    domainAge: {
      registrationDate: rdapResult.registrationDate,
      expirationDate: rdapResult.expirationDate,
      updatedDate: rdapResult.updatedDate,
      ageDays,
      isNewlyRegistered,
      isRecentlyRegistered,
    },
    registrar: {
      name: rdapResult.registrarName,
      abuseContact: rdapResult.abuseContact,
      url: rdapResult.registrarUrl,
    },
    nameservers: uniqueNameservers,
    dnsRecords: {
      a: aRecords,
      aaaa: aaaaRecords,
      mx: mxRecords,
      txt: txtRecords,
      cname: cnameRecords,
      ns: nsRecords,
    },
    riskIndicators,
    lookupStatus,
    lookupTimestamp: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
  };
}
