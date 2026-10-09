const path = require("path");
const fs = require("fs");

// Native .env parser
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, "utf8");
  envText.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      let val = (match[2] || "").trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[match[1]] = val;
    }
  });
}

// Auto-sanitize URL
function sanitizeDatabaseUrl(rawUrl) {
  if (!rawUrl || !rawUrl.startsWith("mysql://")) return rawUrl;
  const atCount = (rawUrl.match(/@/g) || []).length;
  if (atCount > 1) {
    const lastAtIndex = rawUrl.lastIndexOf("@");
    const userPassPart = rawUrl.substring("mysql://".length, lastAtIndex);
    const hostPart = rawUrl.substring(lastAtIndex + 1);
    const firstColon = userPassPart.indexOf(":");
    if (firstColon !== -1) {
      const user = userPassPart.substring(0, firstColon);
      const pass = userPassPart.substring(firstColon + 1);
      const encodedPass = encodeURIComponent(decodeURIComponent(pass));
      return `mysql://${user}:${encodedPass}@${hostPart}`;
    }
  }
  return rawUrl;
}

const sanitized = sanitizeDatabaseUrl(process.env.DATABASE_URL);
if (sanitized) process.env.DATABASE_URL = sanitized;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: sanitized ? { db: { url: sanitized } } : undefined,
});

async function addCases() {
  console.log("\n=======================================================");
  console.log("   POPULATING HIGH & MEDIUM THREAT CASES FOR CHARTS    ");
  console.log("=======================================================\n");

  const org = await prisma.organization.findFirst();
  if (!org) {
    console.error("❌ No organization found. Run database seed first.");
    process.exit(1);
  }

  const analyst = await prisma.user.findFirst({ where: { role: "ANALYST" } });
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });

  const cases = [
    // ---------------- HIGH RISK CASES (40 - 69) ----------------
    {
      submittedUrl: "https://secure-login.corporate-sso-gateway.net/auth/portal",
      normalizedHostname: "secure-login.corporate-sso-gateway.net",
      registrableDomain: "corporate-sso-gateway.net",
      riskScore: 65,
      severity: "HIGH",
      heuristicScore: 65,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "HIGH RISK: Multi-tiered subdomains with authentication targeting tokens on an untrusted corporate-sso apex domain.",
      limitations: JSON.stringify(["Offline lexical inspection", "High confidence"]),
      signals: [
        {
          signalType: "SUSPICIOUS_SUBDOMAINS",
          category: "DOMAIN_STRUCTURE",
          title: "Multi-Tiered Security Subdomain",
          description: "Subdomain 'secure-login' prepended to unverified apex domain.",
          evidence: "secure-login.corporate-sso-gateway.net",
          weight: 25,
          confidence: "HIGH",
        },
        {
          signalType: "AUTH_CREDENTIAL_TARGETING_PATH",
          category: "URL_ANOMALY",
          title: "SSO Portal Path Keywords",
          description: "Targeting enterprise Single Sign-On credentials.",
          evidence: "/auth/portal",
          weight: 25,
          confidence: "HIGH",
        },
        {
          signalType: "HIGH_SHANNON_ENTROPY",
          category: "URL_ANOMALY",
          title: "High Lexical Complexity",
          description: "Unusually long hyphenated hostname structure.",
          evidence: "Entropy: 3.82 bits/byte",
          weight: 15,
          confidence: "MEDIUM",
        },
      ],
      intel: [
        {
          provider: "LOCAL_TEST_FEED",
          status: "NO_MATCH",
          matchDetails: "Unrated by third-party feeds, flagged by internal heuristics",
        },
      ],
      incident: {
        title: "Enterprise SSO Impersonation (corporate-sso-gateway.net)",
        description: "Deceptive domain mimicking corporate single sign-on access point.",
        severity: "HIGH",
        status: "INVESTIGATING",
        assignedUserId: analyst ? analyst.id : null,
      },
    },
    {
      submittedUrl: "https://g00gle-workspace-apps.co/drive/shared-file",
      normalizedHostname: "g00gle-workspace-apps.co",
      registrableDomain: "g00gle-workspace-apps.co",
      riskScore: 58,
      severity: "HIGH",
      heuristicScore: 58,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "HIGH RISK: Typosquatting of Google with digit substitution '00' mimicking Google Workspace file sharing.",
      limitations: JSON.stringify(["Heuristic model", "Lexical safe"]),
      signals: [
        {
          signalType: "HOMOGLYPH_SUBSTITUTION",
          category: "BRAND_IMPERSONATION",
          title: "Homoglyph Typo (Google -> g00gle)",
          description: "Substitutes 'oo' with numeric '00' on .co domain.",
          evidence: "g00gle vs google (edit distance: 2)",
          weight: 35,
          confidence: "HIGH",
        },
        {
          signalType: "SUSPICIOUS_HYPHENATION",
          category: "DOMAIN_STRUCTURE",
          title: "Multi-Word Brand Chaining",
          description: "Chains brand typosquat with 'workspace-apps'.",
          evidence: "2 hyphens in hostname",
          weight: 15,
          confidence: "HIGH",
        },
      ],
      intel: [],
      incident: {
        title: "Google Workspace Lookalike Domain (g00gle-workspace-apps.co)",
        description: "Potential spear-phishing domain targeting collaborative document sharing.",
        severity: "HIGH",
        status: "NEW",
        assignedUserId: null,
      },
    },
    {
      submittedUrl: "https://bank-documents-delivery.s3-accelerate.cloud/invoice.pdf.exe",
      normalizedHostname: "bank-documents-delivery.s3-accelerate.cloud",
      registrableDomain: "s3-accelerate.cloud",
      riskScore: 62,
      severity: "HIGH",
      heuristicScore: 62,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "HIGH RISK: Masquerading double extension (.pdf.exe) mimicking bank invoice document delivery.",
      limitations: JSON.stringify(["Lexical file pattern"]),
      signals: [
        {
          signalType: "DOUBLE_FILE_EXTENSION",
          category: "URL_ANOMALY",
          title: "Deceptive Double Extension (.pdf.exe)",
          description: "Executable binary disguised as a PDF document.",
          evidence: "invoice.pdf.exe",
          weight: 35,
          confidence: "HIGH",
        },
        {
          signalType: "BRAND_KEYWORD_INCLUSION",
          category: "BRAND_IMPERSONATION",
          title: "Banking Keyword Lure",
          description: "Includes banking and document delivery keywords.",
          evidence: "bank-documents-delivery",
          weight: 20,
          confidence: "HIGH",
        },
      ],
      intel: [],
      incident: {
        title: "Malicious Invoice Executable Delivery Campaign",
        description: "Double extension payload hosted under cloud-accelerate disguised domain.",
        severity: "HIGH",
        status: "INVESTIGATING",
        assignedUserId: admin ? admin.id : null,
      },
    },

    // ---------------- MEDIUM RISK CASES (20 - 39) ----------------
    {
      submittedUrl: "https://x79a-internal-telemetry.ddns.net/status/api",
      normalizedHostname: "x79a-internal-telemetry.ddns.net",
      registrableDomain: "ddns.net",
      riskScore: 35,
      severity: "MEDIUM",
      heuristicScore: 35,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "MEDIUM RISK: Free Dynamic DNS provider with randomized alphanumeric prefix, often used for transient testing or unvetted endpoints.",
      limitations: JSON.stringify(["Dynamic DNS feed check"]),
      signals: [
        {
          signalType: "DYNAMIC_DNS_PROVIDER",
          category: "NETWORK_HEURISTIC",
          title: "Dynamic DNS Host (ddns.net)",
          description: "Free dynamic DNS provider frequently rotated in transient deployments.",
          evidence: "Host ends with ddns.net",
          weight: 20,
          confidence: "MEDIUM",
        },
        {
          signalType: "HIGH_SHANNON_ENTROPY",
          category: "URL_ANOMALY",
          title: "Randomized Prefix Entropy",
          description: "Hexadecimal-like prefix 'x79a' increases entropy score.",
          evidence: "Prefix: x79a (Entropy: 3.4)",
          weight: 15,
          confidence: "MEDIUM",
        },
      ],
      intel: [],
    },
    {
      submittedUrl: "https://customer-service-portal-update.tk/inquiry/support",
      normalizedHostname: "customer-service-portal-update.tk",
      registrableDomain: "customer-service-portal-update.tk",
      riskScore: 28,
      severity: "MEDIUM",
      heuristicScore: 28,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "MEDIUM RISK: Free .tk top-level domain coupled with generic support and update keywords.",
      limitations: JSON.stringify(["TLD reputation"]),
      signals: [
        {
          signalType: "HIGH_RISK_TLD",
          category: "DOMAIN_STRUCTURE",
          title: "Low-Reputation Free TLD (.tk)",
          description: "Free top-level domain with documented history of spam/abuse.",
          evidence: "TLD: .tk",
          weight: 15,
          confidence: "HIGH",
        },
        {
          signalType: "SUSPICIOUS_HYPHENATION",
          category: "DOMAIN_STRUCTURE",
          title: "Chained Generic Support Keywords",
          description: "Customer service and portal update string concatenation.",
          evidence: "3 hyphens in apex domain",
          weight: 13,
          confidence: "MEDIUM",
        },
      ],
      intel: [],
    },
    {
      submittedUrl: "https://global-offers-redirect.info/click?target=https%3A%2F%2Fpartner-promo.com",
      normalizedHostname: "global-offers-redirect.info",
      registrableDomain: "global-offers-redirect.info",
      riskScore: 24,
      severity: "MEDIUM",
      heuristicScore: 24,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "MEDIUM RISK: Open redirect parameter structure on marketing TLD (.info).",
      limitations: JSON.stringify(["Lexical parameter inspection"]),
      signals: [
        {
          signalType: "OPEN_REDIRECT_PARAMETER",
          category: "URL_ANOMALY",
          title: "External URL in Query Parameter",
          description: "Contains embedded 'target=https://...' parameter.",
          evidence: "Query parameter carries full external URL",
          weight: 15,
          confidence: "MEDIUM",
        },
        {
          signalType: "HIGH_RISK_TLD",
          category: "DOMAIN_STRUCTURE",
          title: "Marketing Aggregator TLD (.info)",
          description: "Low-cost TLD with variable reputation.",
          evidence: "TLD: .info",
          weight: 9,
          confidence: "LOW",
        },
      ],
      intel: [],
    },
  ];

  let addedCount = 0;
  for (const c of cases) {
    const existing = await prisma.analysis.findFirst({
      where: { organizationId: org.id, submittedUrl: c.submittedUrl },
    });

    if (!existing) {
      const created = await prisma.analysis.create({
        data: {
          organizationId: org.id,
          submittedUrl: c.submittedUrl,
          normalizedHostname: c.normalizedHostname,
          registrableDomain: c.registrableDomain,
          riskScore: c.riskScore,
          severity: c.severity,
          heuristicScore: c.heuristicScore,
          analysisStatus: c.analysisStatus,
          intelligenceStatus: c.intelligenceStatus,
          aiExplanation: c.aiExplanation,
          limitations: c.limitations,
          signals: {
            create: c.signals.map((s) => ({
              signalType: s.signalType,
              category: s.category,
              title: s.title,
              description: s.description,
              evidence: s.evidence,
              weight: s.weight,
              confidence: s.confidence,
            })),
          },
          intelResults: {
            create: (c.intel || []).map((i) => ({
              provider: i.provider,
              status: i.status,
              matchDetails: i.matchDetails,
            })),
          },
        },
      });

      if (c.incident) {
        await prisma.incident.create({
          data: {
            organizationId: org.id,
            analysisId: created.id,
            title: c.incident.title,
            description: c.incident.description,
            severity: c.incident.severity,
            status: c.incident.status,
            assignedUserId: c.incident.assignedUserId,
          },
        });
      }

      addedCount++;
      console.log(`✔ Added [${c.severity}] (${c.riskScore}/100): ${c.normalizedHostname}`);
    } else {
      console.log(`ℹ Already exists: ${c.normalizedHostname}`);
    }
  }

  // Final count summary
  const [critCount, highCount, medCount, lowCount] = await Promise.all([
    prisma.analysis.count({ where: { organizationId: org.id, severity: "CRITICAL" } }),
    prisma.analysis.count({ where: { organizationId: org.id, severity: "HIGH" } }),
    prisma.analysis.count({ where: { organizationId: org.id, severity: "MEDIUM" } }),
    prisma.analysis.count({ where: { organizationId: org.id, severity: "LOW" } }),
  ]);

  console.log("\n=======================================================");
  console.log("             UPDATED RISK LEVEL DISTRIBUTION           ");
  console.log("=======================================================");
  console.log(`  Critical (70-100) : ${critCount} cases`);
  console.log(`  High (40-69)     : ${highCount} cases`);
  console.log(`  Medium (20-39)   : ${medCount} cases`);
  console.log(`  Low (0-19)       : ${lowCount} cases`);
  console.log("=======================================================\n");

  await prisma.$disconnect();
}

addCases().catch((err) => {
  console.error("Error adding cases:", err);
  process.exit(1);
});
