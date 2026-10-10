import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const BILY_SYSTEM_PROMPT = `You are Bily, the elite AI Cyber Threat Intelligence Copilot and SecOps Analyst for the Optimus Digital Risk Protection (DRP) Platform.
Your purpose:
1. Assist SOC analysts, security researchers, and enterprise users in evaluating digital threats, suspicious URLs, homoglyph typosquatting, credential harvesting, brand impersonation, and malicious infrastructure.
2. Explain how risk scoring works: Heuristic analysis (0-100), IoC Threat Feeds (Google Safe Browsing, VirusTotal, URLScan), lexical anomalies, and brand similarity (Levenshtein distance).
3. Provide actionable incident response playbooks (containment, DNS sinkholing, registrar takedown, IOC correlation).
4. Guide users on navigating the Optimus console (Analyzer, Incident tracking, Brand Assets, Protected Domain monitoring, Single Sign-On).

Style guidelines:
- Tone: Highly knowledgeable, precise, executive-ready, professional, and cyber-aware.
- Formatting: Use structured markdown, bold key points, bullet lists, and code blocks for IoCs or URLs where helpful.
- Keep answers focused, insightful, and actionable.`;

// Intelligent Cyber Knowledge Engine (Fallback when no external AI API key is configured)
function getOfflineBilyResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("who are you") || q.includes("your name") || q.includes("what is bily")) {
    return `### Hello! I am **Bily** 🛡️
I am your **Autonomous AI Cyber Threat Copilot & SecOps Intelligence Analyst** embedded directly within the **Optimus DRP Platform**.

Here is what I can do for you:
* **Suspicious URL & Threat Triage**: Explain risk heuristics, lexical anomalies, and attack indicators.
* **Brand Protection**: Identify typosquatting, homoglyph character substitutions, and subdomain spoofing.
* **Incident Response**: Offer triage playbooks for Critical/High severity domain threats.
* **Platform Operations**: Guide you through telemetry feeds, brand assets, and SSO configurations.

How can I assist your security operations right now?`;
  }

  if (q.includes("risk score") || q.includes("scoring") || q.includes("heuristic")) {
    return `### Optimus Risk Scoring Methodology 📊

Optimus utilizes a multi-layered heuristic and intelligence fusion engine scored from **0 to 100**:

1. **Heuristic Engine (0-75 points)**:
   * **Brand Spoofing & Homoglyphs** (+30 to +35 pts): Subdomain prepending, typosquatting (e.g. \`paypa1\`), and Levenshtein similarity against protected assets.
   * **Credential Path Targeting** (+25 pts): Keyword heuristics like \`/verify\`, \`/login/session\`, \`/portal/auth\`.
   * **High-Risk TLDs & Dynamic DNS** (+15 to +20 pts): Free or high-abuse TLDs (\`.xyz\`, \`.top\`, \`.tk\`) and transient DDNS hosts.
   * **IP-based Hosts & Non-Standard Ports** (+15 to +30 pts): Direct IPv4/IPv6 hosting or unusual listening ports (e.g., 8443).

2. **External Threat Intel Overrides**:
   * If a confirmed IoC match is found in **Google Safe Browsing**, **VirusTotal**, or **URLScan**, the risk score is automatically elevated to **Critical (85+)**.

3. **Severity Buckets**:
   * 🔴 **Critical (70-100)**: Immediate malicious probability — takedown advised.
   * 🟠 **High (40-69)**: High-suspicion anomalies — active monitoring required.
   * 🟡 **Medium (20-39)**: Moderate deviations or low-reputation infrastructure.
   * 🔵 **Low (0-19)**: Benign or verified legitimate enterprise asset.`;
  }

  if (q.includes("brand") || q.includes("homoglyph") || q.includes("typosquat")) {
    return `### Brand Impersonation & Homoglyph Detection 🔍

Attackers target digital brands using deceptive visual techniques:

* **Homoglyphs**: Substituting visually similar ASCII or Unicode characters (e.g., letter \`l\` with digit \`1\`, \`o\` with \`0\`, or Cyrillic characters).
* **Subdomain Spoofing**: Crafting subdomains like \`login.microsoft.com.attacker-domain.xyz\` to trick users on mobile screens where only the prefix shows.
* **Hyphenated Combos**: Inserting security terms (\`brand-security-update.com\`).

**How Optimus Defends**:
1. You register official brand assets and keywords in the **Brands** tab.
2. The engine computes Levenshtein distance and regex pattern matches on every analyzed URL.
3. High similarity matches trigger automated **Brand Impersonation Alerts**.`;
  }

  if (q.includes("incident") || q.includes("playbook") || q.includes("takedown")) {
    return `### Incident Response Playbook (Domain Threats) 🚨

When a **Critical** severity domain is identified:

1. **Phase 1: Containment**:
   * Add the domain and host IP to internal DNS sinkholes / firewall perimeter blocklists.
   * Invalidate any SSO tokens or user sessions that may have interacted with the threat.
2. **Phase 2: Investigation & Evidence**:
   * Review all signals gathered by Optimus (HTTP status, SSL certificate, registrar info).
   * File investigation notes directly on the **Incident Detail** page.
3. **Phase 3: Remediation & Takedown**:
   * Submit an abuse complaint to the authoritative registrar and hosting ASN provider.
   * Submit IoC reports to Google Safe Browsing and APWG for public browser blacklisting.
4. **Phase 4: Resolution**:
   * Once DNS records cease resolving, update the incident status to **RESOLVED**.`;
  }

  if (q.includes("sso") || q.includes("google") || q.includes("microsoft") || q.includes("login")) {
    return `### Single Sign-On (Google & Microsoft) Integration 🔐

Optimus supports both **Enterprise SSO** and **Direct Analyst Credentials**:

* **Google SSO**: Authenticates through Google Identity Services (OAuth 2.0). Requires \`GOOGLE_CLIENT_ID\` and \`GOOGLE_CLIENT_SECRET\`.
* **Microsoft SSO**: Integrates with Microsoft Entra ID (Azure AD) via OpenID Connect. Requires \`MICROSOFT_CLIENT_ID\` and \`MICROSOFT_CLIENT_SECRET\`.
* **Quick Demo SSO**: If testing without production OAuth credentials, click **Quick Demo SSO** on the login screen to sign in instantly as any analyst!

All authenticated sessions generate a cryptographically signed \`drp_session\` JWT cookie with enterprise RBAC roles (*ADMIN*, *ANALYST*, *VIEWER*).`;
  }

  // Default intelligent response for general cybersecurity questions
  return `### Security Intelligence Analysis 🧠

Regarding your inquiry: **"${query.slice(0, 80)}"**

Key defensive observations from the **Optimus Threat Intelligence Core**:
* **Attack Surface Management**: Always correlate incoming alerts with active telemetry. Verify domain WHOIS registration age and registrar reputation.
* **Defense in Depth**: Combine automated heuristic screening with external IoC threat feeds for highest confidence.
* **Actionable Next Step**: You can input any suspicious URL into the **[Analyzer](/analyzer)** to view full signal decomposition and heuristic scores.

*Feel free to ask me to analyze a specific URL, explain a signal type, or guide you through incident remediation!*`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const aiApiKey = (process.env.AI_API_KEY || process.env.GEMINI_API_KEY || "").trim();

    // 1. If Gemini / external LLM API key is configured, use it
    if (aiApiKey) {
      try {
        const contents = [
          {
            role: "user",
            parts: [{ text: `${BILY_SYSTEM_PROMPT}\n\nUser Question: ${message}` }],
          },
        ];

        // Include recent conversation context if available
        if (Array.isArray(history) && history.length > 0) {
          const recent = history.slice(-6).map((h: ChatMessage) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          }));
          contents.unshift(...(recent as any));
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${aiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const candidateText =
            data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return NextResponse.json({
              reply: candidateText,
              provider: "gemini-1.5-flash",
              isLiveLLM: true,
            });
          }
        } else {
          console.warn("External Gemini API call returned non-200, falling back to local SecOps engine");
        }
      } catch (err: any) {
        console.warn("External AI call failed, falling back to local SecOps engine:", err.message);
      }
    }

    // 2. Intelligent Built-in Cyber Intelligence Copilot response
    const offlineReply = getOfflineBilyResponse(message.trim());
    return NextResponse.json({
      reply: offlineReply,
      provider: "bily-secops-engine",
      isLiveLLM: false,
    });
  } catch (error: any) {
    console.error("Bily AI error:", error);
    return NextResponse.json(
      { error: "Bily encountered an error processing your query" },
      { status: 500 }
    );
  }
}
