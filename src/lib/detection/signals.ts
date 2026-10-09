import { ParsedUrlDetails } from "./url-parser";

export interface DetectionSignalResult {
  signalType: string;
  category: "DOMAIN_STRUCTURE" | "BRAND_IMPERSONATION" | "URL_ANOMALY" | "NETWORK_HEURISTIC" | "REPUTATION";
  title: string;
  description: string;
  evidence: string;
  weight: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

// Suspicious suspicious words often observed in phishing paths / subdomains
const SUSPICIOUS_AUTH_KEYWORDS = [
  "login", "signin", "sign-in", "log-in", "auth", "authenticate", "account",
  "verification", "verify", "secure", "update-payment", "banking", "wallet",
  "recover", "billing", "confirm", "security-check", "session-expired", "kyc-verify"
];

// Suspicious Top Level Domains commonly abused in short-lived phishing
const HIGH_RISK_TLDS = new Set([
  "zip", "mov", "top", "xyz", "click", "rest", "buzz", "gq", "ml", "cf", "tk", "ga", "country", "work", "loan"
]);

// Shannon Entropy calculation for domain randomness (DGA detection)
export function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  const frequencies: Record<string, number> = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const count of Object.values(frequencies)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return Math.round(entropy * 100) / 100;
}

export function extractHeuristicSignals(parsed: ParsedUrlDetails): DetectionSignalResult[] {
  const signals: DetectionSignalResult[] = [];
  if (!parsed.isValid) {
    return signals;
  }

  const {
    normalizedUrl,
    hostname,
    pathname,
    search,
    registrableDomain,
    subdomain,
    isIpAddress,
    tld,
  } = parsed;

  const urlLower = normalizedUrl.toLowerCase();
  const hostLower = hostname.toLowerCase();
  const pathLower = pathname.toLowerCase();
  const searchLower = search.toLowerCase();

  // 1. IP Address as Hostname
  if (isIpAddress) {
    signals.push({
      signalType: "IP_ADDRESS_HOSTNAME",
      category: "NETWORK_HEURISTIC",
      title: "Direct IP Address Used as Hostname",
      description: "Legitimate websites rarely use raw IP addresses instead of registered domain names. Phishing and malware C2 infrastructure frequently utilize raw IP addresses.",
      evidence: `Hostname is direct IP address: ${hostname}`,
      weight: 30,
      confidence: "HIGH",
    });
  }

  // 2. Excessive Subdomain Depth
  const subdomainParts = subdomain ? subdomain.split(".").filter(Boolean) : [];
  if (subdomainParts.length >= 3) {
    signals.push({
      signalType: "EXCESSIVE_SUBDOMAINS",
      category: "DOMAIN_STRUCTURE",
      title: "Excessive Subdomain Depth",
      description: "Multiple subdomain levels are often used in phishing campaigns to spoof legitimate brands or evade domain reputation filters.",
      evidence: `Subdomain has ${subdomainParts.length} levels: "${subdomain}"`,
      weight: 20,
      confidence: "MEDIUM",
    });
  }

  // 3. High Shannon Entropy (Domain Generation Algorithm / Random Strings)
  const baseDomainName = registrableDomain.split(".")[0];
  const entropy = calculateShannonEntropy(baseDomainName);
  if (baseDomainName.length >= 8 && entropy >= 3.4) {
    signals.push({
      signalType: "HIGH_DOMAIN_ENTROPY",
      category: "DOMAIN_STRUCTURE",
      title: "High Entropy / Pseudorandom Domain Name",
      description: "The domain name has a high degree of character randomness, which is characteristic of Domain Generation Algorithms (DGAs) or disposable malicious domains.",
      evidence: `Base domain "${baseDomainName}" has Shannon entropy of ${entropy} (threshold: 3.4)`,
      weight: 15,
      confidence: "MEDIUM",
    });
  }

  // 4. Repeated Hyphens or Consecutive Punctuations in Domain
  if (hostLower.includes("--") || (hostLower.match(/-/g) || []).length >= 3) {
    signals.push({
      signalType: "SUSPICIOUS_HYPHENATION",
      category: "DOMAIN_STRUCTURE",
      title: "Excessive or Repeated Hyphens in Hostname",
      description: "Multiple hyphens are commonly used to chain legitimate-looking brand names together (e.g. paypal-security-update-center).",
      evidence: `Hostname contains ${((hostLower.match(/-/g) || []).length)} hyphens: "${hostname}"`,
      weight: 15,
      confidence: "HIGH",
    });
  }

  // 5. Suspicious Authentication Keywords in Path or Parameters
  const foundKeywords = SUSPICIOUS_AUTH_KEYWORDS.filter(
    (kw) => pathLower.includes(kw) || searchLower.includes(kw)
  );
  if (foundKeywords.length > 0) {
    // Check if it's on an IP or non-reputable TLD for higher weight
    const isSuspiciousContext = isIpAddress || HIGH_RISK_TLDS.has(tld) || subdomainParts.length >= 2;
    signals.push({
      signalType: "AUTH_CREDENTIAL_TARGETING_PATH",
      category: "URL_ANOMALY",
      title: "Credential / Verification Keywords in Path",
      description: "The URL path or query string contains authentication or security verification terms.",
      evidence: `Keywords identified: [${foundKeywords.join(", ")}] in path/query "${pathname}${search}"`,
      weight: isSuspiciousContext ? 25 : 10,
      confidence: isSuspiciousContext ? "HIGH" : "LOW",
    });
  }

  // 6. High-Risk or Unconventional TLD
  if (HIGH_RISK_TLDS.has(tld)) {
    signals.push({
      signalType: "HIGH_RISK_TLD",
      category: "DOMAIN_STRUCTURE",
      title: "High-Abuse Top-Level Domain (TLD)",
      description: `The top-level domain (.${tld}) has a statistically higher incidence of disposable spam and phishing campaigns.`,
      evidence: `Top-Level Domain is .${tld}`,
      weight: 15,
      confidence: "MEDIUM",
    });
  }

  // 7. Excessive URL Length and Query String Obfuscation
  if (normalizedUrl.length > 150) {
    signals.push({
      signalType: "UNUSUAL_URL_LENGTH",
      category: "URL_ANOMALY",
      title: "Abnormally Long URL Structure",
      description: "Extremely long URLs are often used to conceal malicious payload parameters or redirect chains.",
      evidence: `Total URL length is ${normalizedUrl.length} characters (baseline normal: <100)`,
      weight: 10,
      confidence: "LOW",
    });
  }

  // 8. Excessive URL Hex/Percent Encoding
  const percentEncodings = (normalizedUrl.match(/%[0-9a-fA-F]{2}/g) || []).length;
  if (percentEncodings >= 4) {
    signals.push({
      signalType: "EXCESSIVE_PERCENT_ENCODING",
      category: "URL_ANOMALY",
      title: "Excessive URL Encoding / Obfuscation",
      description: "Multiple percent-encoded character sequences may indicate an attempt to evade automated URL inspection filters.",
      evidence: `Detected ${percentEncodings} percent-encoded hex sequences in URL`,
      weight: 15,
      confidence: "MEDIUM",
    });
  }

  // 9. Non-Standard Ports
  if (parsed.port && !["80", "443", ""].includes(parsed.port)) {
    signals.push({
      signalType: "NON_STANDARD_PORT",
      category: "NETWORK_HEURISTIC",
      title: "Non-Standard Web Port Specified",
      description: `URL explicitly directs traffic to port ${parsed.port}, atypical for standard user-facing web services.`,
      evidence: `Port ${parsed.port} specified in URL`,
      weight: 15,
      confidence: "MEDIUM",
    });
  }

  // 10. Embedded Credentials / Userinfo (e.g. https://admin:password@domain.com)
  if (urlLower.includes("@") && urlLower.indexOf("@") < urlLower.indexOf(hostname) + hostname.length) {
    signals.push({
      signalType: "EMBEDDED_USERINFO",
      category: "URL_ANOMALY",
      title: "Deceptive Userinfo / @ Symbol in Authority",
      description: "Using '@' in URLs is a classic phishing technique where the text before '@' resembles a legitimate domain while the browser navigates to the host after '@'.",
      evidence: "Deceptive @ symbol present in URL authority segment",
      weight: 35,
      confidence: "HIGH",
    });
  }

  return signals;
}
