/**
 * URL Parsing & Normalization Service
 * Strictly performs offline lexical and structural analysis without issuing outbound HTTP/DNS requests (SSRF Safe).
 */

export interface ParsedUrlDetails {
  isValid: boolean;
  rawInput: string;
  normalizedUrl: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  registrableDomain: string;
  subdomain: string;
  isIpAddress: boolean;
  ipVersion?: "v4" | "v6";
  tld: string;
  errorMessage?: string;
}

// Common TLDs and known compound public suffixes
const MULTI_PART_TLDS = new Set([
  "co.uk", "org.uk", "gov.uk", "ac.uk",
  "com.au", "net.au", "org.au", "edu.au",
  "co.in", "net.in", "org.in", "gov.in", "gen.in",
  "co.jp", "ne.jp", "ac.jp", "go.jp",
  "com.br", "net.br", "org.br",
  "co.nz", "net.nz", "org.nz",
  "com.sg", "edu.sg", "gov.sg",
  "com.tr", "edu.tr", "gov.tr",
]);

export function parseAndNormalizeUrl(input: string): ParsedUrlDetails {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      rawInput: input,
      normalizedUrl: "",
      protocol: "",
      hostname: "",
      port: "",
      pathname: "",
      search: "",
      hash: "",
      registrableDomain: "",
      subdomain: "",
      isIpAddress: false,
      errorMessage: "Input URL is empty",
      tld: "",
    };
  }

  // Prepend scheme if missing for standard URL parser
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = "https://" + candidate;
  }

  try {
    const url = new URL(candidate);
    let hostname = url.hostname.toLowerCase();

    // Check for IP Address
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^\[?[0-9a-fA-F:]+\]?$/;

    let isIpAddress = false;
    let ipVersion: "v4" | "v6" | undefined;

    if (ipv4Regex.test(hostname)) {
      isIpAddress = true;
      ipVersion = "v4";
    } else if (ipv6Regex.test(hostname) && hostname.includes(":")) {
      isIpAddress = true;
      ipVersion = "v6";
    }

    // Determine TLD, Registrable Domain, and Subdomain
    let tld = "";
    let registrableDomain = hostname;
    let subdomain = "";

    if (!isIpAddress) {
      const parts = hostname.split(".");
      if (parts.length >= 2) {
        const lastTwo = parts.slice(-2).join(".");
        if (MULTI_PART_TLDS.has(lastTwo) && parts.length >= 3) {
          tld = lastTwo;
          registrableDomain = parts.slice(-3).join(".");
          subdomain = parts.slice(0, -3).join(".");
        } else {
          tld = parts[parts.length - 1];
          registrableDomain = parts.slice(-2).join(".");
          subdomain = parts.slice(0, -2).join(".");
        }
      }
    } else {
      registrableDomain = hostname;
    }

    return {
      isValid: true,
      rawInput: input,
      normalizedUrl: url.toString(),
      protocol: url.protocol.replace(":", ""),
      hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      registrableDomain,
      subdomain,
      isIpAddress,
      ipVersion,
      tld,
    };
  } catch (err: any) {
    return {
      isValid: false,
      rawInput: input,
      normalizedUrl: "",
      protocol: "",
      hostname: "",
      port: "",
      pathname: "",
      search: "",
      hash: "",
      registrableDomain: "",
      subdomain: "",
      isIpAddress: false,
      errorMessage: err.message || "Invalid URL syntax",
      tld: "",
    };
  }
}
