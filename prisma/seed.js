const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { id: "org-cyberdefend-01" },
    update: {},
    create: {
      id: "org-cyberdefend-01",
      name: "CyberDefend Global Security Operations",
    },
  });

  console.log(`Created Organization: ${org.name}`);

  // 2. Hash Passwords
  const adminHash = await bcrypt.hash("admin123!", 10);
  const analystHash = await bcrypt.hash("analyst123!", 10);
  const viewerHash = await bcrypt.hash("viewer123!", 10);

  // 3. Create Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@optimus-drp.io" },
    update: {},
    create: {
      name: "Alex Vance (SecOps Lead)",
      username: "admin_secops",
      email: "admin@optimus-drp.io",
      passwordHash: adminHash,
      role: "ADMIN",
      organizationId: org.id,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@optimus-drp.io" },
    update: {},
    create: {
      name: "Jordan Hayes (SOC Analyst)",
      username: "analyst_jordan",
      email: "analyst@optimus-drp.io",
      passwordHash: analystHash,
      role: "ANALYST",
      organizationId: org.id,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: "viewer@optimus-drp.io" },
    update: {},
    create: {
      name: "Morgan Lee (Executive / Auditor)",
      username: "viewer_morgan",
      email: "viewer@optimus-drp.io",
      passwordHash: viewerHash,
      role: "VIEWER",
      organizationId: org.id,
    },
  });

  console.log("Created 3 initial role-based users (Admin, Analyst, Viewer)");

  // 4. Create Protected Brand Assets
  const brands = [
    {
      brandName: "Microsoft",
      officialDomain: "microsoft.com",
      aliases: JSON.stringify(["office.com", "azure.com", "live.com"]),
    },
    {
      brandName: "PayPal",
      officialDomain: "paypal.com",
      aliases: JSON.stringify(["paypal-objects.com", "paypal-communication.com"]),
    },
    {
      brandName: "Apple",
      officialDomain: "apple.com",
      aliases: JSON.stringify(["icloud.com", "appleid.apple.com"]),
    },
    {
      brandName: "Bank of America",
      officialDomain: "bankofamerica.com",
      aliases: JSON.stringify(["bofa.com", "bankofamerica.net"]),
    },
    {
      brandName: "Google",
      officialDomain: "google.com",
      aliases: JSON.stringify(["gmail.com", "google.co.uk"]),
    },
  ];

  for (const b of brands) {
    const existing = await prisma.brandAsset.findFirst({
      where: { organizationId: org.id, officialDomain: b.officialDomain },
    });
    if (!existing) {
      await prisma.brandAsset.create({
        data: {
          organizationId: org.id,
          brandName: b.brandName,
          officialDomain: b.officialDomain,
          aliases: b.aliases,
          isActive: true,
        },
      });
    }
  }

  console.log("Created Protected Brand Assets");

  // 5. Seed Demonstration Analyses & Incidents
  const sampleAnalyses = [
    {
      submittedUrl: "https://login.microsoft.com.account-update-portal.xyz/verify/session?auth=token",
      normalizedHostname: "login.microsoft.com.account-update-portal.xyz",
      registrableDomain: "account-update-portal.xyz",
      riskScore: 85,
      severity: "CRITICAL",
      heuristicScore: 85,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "MATCH_FOUND",
      aiExplanation: "CRITICAL THREAT: Subdomain impersonation targeting Microsoft combined with credential harvesting keywords on a high-risk .xyz TLD.",
      limitations: JSON.stringify(["Offline lexical inspection", "Simulated demo dataset"]),
      signals: [
        {
          signalType: "SUBDOMAIN_IMPERSONATION",
          category: "BRAND_IMPERSONATION",
          title: "Subdomain Brand Spoofing (Microsoft)",
          description: "Hostname embeds brand 'Microsoft' under unrelated domain 'account-update-portal.xyz'.",
          evidence: "Prefix contains login.microsoft.com over apex domain account-update-portal.xyz",
          weight: 35,
          confidence: "HIGH",
        },
        {
          signalType: "AUTH_CREDENTIAL_TARGETING_PATH",
          category: "URL_ANOMALY",
          title: "Credential Harvesting Path Tokens",
          description: "Path contains '/verify/session' and 'auth=token'.",
          evidence: "Matched keywords: [verify, session, auth]",
          weight: 25,
          confidence: "HIGH",
        },
        {
          signalType: "HIGH_RISK_TLD",
          category: "DOMAIN_STRUCTURE",
          title: "High-Abuse TLD (.xyz)",
          description: "Apex domain registered under high-abuse TLD.",
          evidence: "TLD is .xyz",
          weight: 15,
          confidence: "MEDIUM",
        },
      ],
      intel: [
        {
          provider: "LOCAL_TEST_FEED",
          status: "MATCH_FOUND",
          matchDetails: "Flagged in Active Phishing Campaign Feed (APWG IoC)",
        },
      ],
      incident: {
        title: "Active Microsoft Credential Harvester (account-update-portal.xyz)",
        description: "Targeted brand impersonation attack targeting corporate Microsoft 365 credentials via deceptive subdomain structure.",
        severity: "CRITICAL",
        status: "INVESTIGATING",
        assignedUserId: analyst.id,
        notes: [
          {
            authorId: analyst.id,
            authorName: analyst.name,
            content: "Initiated takedown notice with Cloudflare registrar. DNS sinkhole applied in internal corporate resolver.",
          },
        ],
      },
    },
    {
      submittedUrl: "https://paypa1-security-center.top/update-billing",
      normalizedHostname: "paypa1-security-center.top",
      registrableDomain: "paypa1-security-center.top",
      riskScore: 75,
      severity: "CRITICAL",
      heuristicScore: 75,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "CRITICAL RISK: Homoglyph typosquatting of PayPal substituting 'l' with '1' and chaining security keywords.",
      limitations: JSON.stringify(["Lexical analysis only", "Safe Browsing cache active"]),
      signals: [
        {
          signalType: "HOMOGLYPH_SUBSTITUTION",
          category: "BRAND_IMPERSONATION",
          title: "Homoglyph Impersonation (PayPal -> paypa1)",
          description: "Replaces letter 'l' with digit '1' to deceive users.",
          evidence: "paypa1 vs paypal (similarity 0.92)",
          weight: 30,
          confidence: "HIGH",
        },
        {
          signalType: "SUSPICIOUS_HYPHENATION",
          category: "DOMAIN_STRUCTURE",
          title: "Hyphenated Security Keyword Association",
          description: "Chains 'security-center' with brand name.",
          evidence: "2 hyphens in hostname",
          weight: 15,
          confidence: "HIGH",
        },
      ],
      intel: [
        {
          provider: "LOCAL_TEST_FEED",
          status: "NO_MATCH",
          matchDetails: "No match in static known feed",
        },
      ],
      incident: {
        title: "Homoglyph Typo-Squatting Campaign: paypa1-security-center.top",
        description: "Typosquatted domain mimicking payment gateway security alert.",
        severity: "HIGH",
        status: "NEW",
        assignedUserId: null,
      },
    },
    {
      submittedUrl: "https://194.26.29.112:8443/login/verify.php",
      normalizedHostname: "194.26.29.112",
      registrableDomain: "194.26.29.112",
      riskScore: 70,
      severity: "CRITICAL",
      heuristicScore: 70,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "HIGH RISK: Direct IPv4 address used with non-standard SSL port 8443 and authentication targeting path.",
      limitations: JSON.stringify(["IP reputation check performed", "Port analysis"]),
      signals: [
        {
          signalType: "IP_ADDRESS_HOSTNAME",
          category: "NETWORK_HEURISTIC",
          title: "Raw IP Address Hostname",
          description: "Direct IP address used instead of reputable FQDN.",
          evidence: "194.26.29.112",
          weight: 30,
          confidence: "HIGH",
        },
        {
          signalType: "NON_STANDARD_PORT",
          category: "NETWORK_HEURISTIC",
          title: "Non-Standard Port 8443",
          description: "Unconventional port for user-facing web services.",
          evidence: "Port: 8443",
          weight: 15,
          confidence: "MEDIUM",
        },
        {
          signalType: "AUTH_CREDENTIAL_TARGETING_PATH",
          category: "URL_ANOMALY",
          title: "Auth Path on IP Host",
          description: "Path contains login / verify keywords.",
          evidence: "/login/verify.php",
          weight: 25,
          confidence: "HIGH",
        },
      ],
      intel: [],
      incident: {
        title: "Direct IP Phishing Endpoint on Port 8443",
        description: "Direct IP hosting a simulated login phishing script.",
        severity: "HIGH",
        status: "ESCALATED",
        assignedUserId: admin.id,
        notes: [
          {
            authorId: admin.id,
            authorName: admin.name,
            content: "Correlated with suspicious inbound email attachment reported by employee.",
          },
        ],
      },
    },
    {
      submittedUrl: "https://www.apple.com/iphone-16-pro/specs/",
      normalizedHostname: "www.apple.com",
      registrableDomain: "apple.com",
      riskScore: 0,
      severity: "LOW",
      heuristicScore: 0,
      analysisStatus: "COMPLETED",
      intelligenceStatus: "NO_MATCH",
      aiExplanation: "BENIGN: Verified official domain for Apple with legitimate structure.",
      limitations: JSON.stringify(["Standard lexical inspection"]),
      signals: [],
      intel: [
        {
          provider: "LOCAL_TEST_FEED",
          status: "NO_MATCH",
          matchDetails: "Clean",
        },
      ],
    },
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
      ],
      intel: [],
      incident: {
        title: "Enterprise SSO Impersonation (corporate-sso-gateway.net)",
        description: "Deceptive domain mimicking corporate single sign-on access point.",
        severity: "HIGH",
        status: "INVESTIGATING",
        assignedUserId: analyst.id,
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
      ],
      intel: [],
      incident: {
        title: "Malicious Invoice Executable Delivery Campaign",
        description: "Double extension payload hosted under cloud-accelerate disguised domain.",
        severity: "HIGH",
        status: "INVESTIGATING",
        assignedUserId: admin.id,
      },
    },
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
      ],
      intel: [],
    },
  ];

  for (const sample of sampleAnalyses) {
    const analysis = await prisma.analysis.create({
      data: {
        organizationId: org.id,
        submittedUrl: sample.submittedUrl,
        normalizedHostname: sample.normalizedHostname,
        registrableDomain: sample.registrableDomain,
        riskScore: sample.riskScore,
        severity: sample.severity,
        heuristicScore: sample.heuristicScore,
        analysisStatus: sample.analysisStatus,
        intelligenceStatus: sample.intelligenceStatus,
        aiExplanation: sample.aiExplanation,
        limitations: sample.limitations,
        signals: {
          create: sample.signals.map((s) => ({
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
          create: sample.intel.map((i) => ({
            provider: i.provider,
            status: i.status,
            matchDetails: i.matchDetails,
          })),
        },
      },
    });

    if (sample.incident) {
      await prisma.incident.create({
        data: {
          organizationId: org.id,
          analysisId: analysis.id,
          title: sample.incident.title,
          description: sample.incident.description,
          severity: sample.incident.severity,
          status: sample.incident.status,
          assignedUserId: sample.incident.assignedUserId,
          notes: sample.incident.notes
            ? {
                create: sample.incident.notes.map((n) => ({
                  authorId: n.authorId,
                  authorName: n.authorName,
                  content: n.content,
                })),
              }
            : undefined,
        },
      });
    }
  }

  // 6. Seed Audit Events
  await prisma.auditEvent.createMany({
    data: [
      {
        organizationId: org.id,
        actorId: admin.id,
        actorEmail: admin.email,
        action: "AUTH_LOGIN",
        resourceType: "User",
        resourceId: admin.id,
        metadata: JSON.stringify({ ip: "127.0.0.1", userAgent: "SOC-Workstation" }),
      },
      {
        organizationId: org.id,
        actorId: analyst.id,
        actorEmail: analyst.email,
        action: "URL_ANALYZED",
        resourceType: "Analysis",
        metadata: JSON.stringify({ domain: "account-update-portal.xyz", score: 85 }),
      },
      {
        organizationId: org.id,
        actorId: analyst.id,
        actorEmail: analyst.email,
        action: "INCIDENT_CREATED",
        resourceType: "Incident",
        metadata: JSON.stringify({ title: "Active Microsoft Credential Harvester" }),
      },
    ],
  });

  console.log("Seeding complete! Admin: admin@optimus-drp.io / admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
