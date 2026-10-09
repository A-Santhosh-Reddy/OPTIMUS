<<<<<<< HEAD
# Optimus Digital Risk Protection Platform (DRP)

An enterprise-grade, evidence-based Digital Risk Protection (DRP) and Threat Intelligence Platform built for security operations centers (SOCs) and incident responders.

---

## 1. Executive Summary & Core Capabilities

The **Optimus DRP Platform** provides proactive defensive visibility into external digital threats targeting an organization's brand, domains, and users:

1. **Suspicious URL & Domain Heuristic Analysis**:
   - 10+ transparent heuristic detection rules (Shannon entropy for DGAs, direct IP address hosts, excessive subdomain nesting, deceptive userinfo `@` symbols, non-standard web ports, credential-targeting keywords, and high-abuse TLDs).
   - **100% SSRF-Safe**: Performs structural and lexical inspection offline without issuing unauthenticated outbound HTTP requests to untrusted target endpoints.

2. **Brand Protection & Lookalike Detection**:
   - Algorithmic evaluation of corporate brand assets against candidate hostnames.
   - Computes **Levenshtein edit distance** for typosquatting variants.
   - Identifies visual **homoglyph substitutions** (e.g. `0` &rarr; `o`, `1` &rarr; `l`, `vv` &rarr; `w`, `rn` &rarr; `m`).
   - Detects multi-tier subdomain brand hijacking (e.g. `login.microsoft.com.attacker-domain.xyz`).

3. **Multi-Source Threat Intelligence**:
   - Modular adapters for Google Safe Browsing API, VirusTotal, and built-in IoC feeds.
   - Preserves strict distinction between **Confirmed Match**, **No Match**, **Inconclusive**, and **Service Unavailable**.
   - Zero-key fallback: Automatically operates with built-in heuristic and verified dataset rules if API keys are not supplied.

4. **Deterministic Evidence-Based Risk Scoring**:
   - Computes an explainable composite risk score from 0 to 100.
   - Categorizes risk into **Critical (70–100)**, **High (40–69)**, **Medium (20–39)**, and **Low (0–19)**.
   - Every score increment is mapped to explicit evidence with documented point contributions.

5. **Explainable AI / Expert Threat Reasoning**:
   - Provides executive threat summaries, uncertainty disclosures, why individual indicators matter, and proportional defensive actions.
   - Supports Gemini/OpenAI API or runs deterministically with built-in expert cybersecurity rules.

6. **SOC Incident Response & Forensics Reporting**:
   - Direct escalation of threat analyses to active SOC incident tracking cases.
   - Chronological investigation notes, status progression (`NEW` &rarr; `INVESTIGATING` &rarr; `ESCALATED` &rarr; `RESOLVED` / `FALSE_POSITIVE`), and analyst conclusion recording.
   - **Downloadable Forensic PDF Reports** compiled via `jsPDF`.

7. **Enterprise Security, RBAC & Audit Trails**:
   - Role-Based Access Control (`ADMIN`, `ANALYST`, `VIEWER`).
   - Tamper-evident, immutable Security Audit Event logging.
   - Bcrypt password hashing and Jose cryptographic JWT sessions.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router & Server Actions)
- **Language**: TypeScript & Node.js
- **Styling**: Tailwind CSS & Lucide Icons (Dark Cybersecurity SOC Theme)
- **Visualization**: Recharts (Risk distribution & threat breakdown charts)
- **Database & ORM**: SQLite (Default zero-config local run) / PostgreSQL compatible via Prisma ORM
- **Authentication**: JWT session cookies (`jose`), Bcrypt password encryption (`bcryptjs`)
- **Validation**: Zod schema validation
- **Reporting**: jsPDF client/server forensic PDF compiler
- **Testing**: Vitest unit & integration test runner

---

## 3. Quick Start & Windows Run Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9+ (Included with Node.js)

### Step 1: Install Dependencies
Open PowerShell or Command Prompt in the project folder:
```powershell
cmd /c npm install
```

### Step 2: Environment Configuration
Copy the example environment file:
```powershell
Copy-Item .env.example .env
```
*(The default `.env` is already configured for out-of-the-box local operation with SQLite and local heuristic intelligence).*

### Step 3: Initialize Database & Seed Demonstration Data
```powershell
cmd /c "npx prisma db push"
cmd /c "node prisma/seed.js"
```

### Step 4: Run Automated Tests
```powershell
cmd /c "npx vitest run"
```

### Step 5: Launch Development Server
```powershell
cmd /c "npm run dev"
```
The application will be accessible at: **[http://localhost:3000](http://localhost:3000)**

---

## 4. Demonstration Accounts & Roles

The seed command populates 3 role-based user accounts for testing:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@optimus-drp.io` | `admin123!` | Full access: Brand Asset Registry, Audit Logs, Findings, Incidents, Threat Intel |
| **Security Analyst**| `analyst@optimus-drp.io`| `analyst123!`| Analyze URLs, Manage Incidents, Add Notes, Export Reports |
| **Read-Only Viewer**| `viewer@optimus-drp.io` | `viewer123!` | Read dashboards, findings, and reports |

---

## 5. Pre-Configured Test Vectors

When testing in the **URL & Domain Analyzer**, you can use the built-in quick test buttons or submit any of these URLs:

1. **Subdomain Brand Impersonation (Critical Risk - Score 85/100)**:
   `https://login.microsoft.com.account-update-portal.xyz/verify/session?auth=token`
   *Heuristics flagged: Subdomain brand hijacking, credential targeting path, high-abuse .xyz TLD.*

2. **Homoglyph Typo-squatting (Critical Risk - Score 75/100)**:
   `https://paypa1-security-center.top/update-billing`
   *Heuristics flagged: Homoglyph substitution (`l` -> `1`), security keyword chaining.*

3. **Direct IP Phishing Endpoint (High Risk - Score 70/100)**:
   `https://194.26.29.112:8443/login/verify.php`
   *Heuristics flagged: Direct IPv4 hostname, non-standard web port 8443, credential path.*

4. **Legitimate Verified Domain (Low / Benign - Score 0/100)**:
   `https://www.apple.com/iphone-16-pro/specs/`
   *Result: Matches official brand asset, zero malicious heuristics.*

---

## 6. Project Architecture & Directory Layout

```
optimus/
├── prisma/
│   ├── schema.prisma              # Relational database schema with 10 entities
│   ├── seed.js                    # Demo seeding script with realistic threat data
│   └── dev.db                     # Local SQLite database
├── src/
│   ├── app/
│   │   ├── (dashboard)/           # Authenticated SOC workspace routes
│   │   │   ├── dashboard/         # Real-time metrics & charts
│   │   │   ├── analyzer/          # URL & domain analysis form
│   │   │   ├── findings/          # Searchable findings repository
│   │   │   ├── incidents/         # SOC incident management & detail views
│   │   │   ├── brands/            # Brand asset registry & protection
│   │   │   ├── threat-intel/      # Threat feed status center
│   │   │   └── audit-logs/        # Immutable security audit logs
│   │   ├── api/                   # RESTful API routes & Server handlers
│   │   │   ├── auth/              # Login, register, logout, me
│   │   │   ├── analyze/           # Threat analysis orchestrator
│   │   │   ├── brands/            # Brand asset CRUD
│   │   │   ├── incidents/         # Incident creation, notes, status patch
│   │   │   ├── dashboard/stats/   # Live database aggregation statistics
│   │   │   └── reports/generate/  # Forensic report generation
│   │   ├── layout.tsx             # Root layout & cyber theme styling
│   │   └── page.tsx               # Public landing page
│   ├── components/
│   │   ├── analyzer/              # URL analyzer form & result inspector
│   │   ├── dashboard/             # Metric cards & Recharts graphs
│   │   ├── navigation/            # SOC sidebar & topbar
│   │   └── ui/                    # Badges, cards, buttons, modals
│   └── lib/
│       ├── auth/                  # JWT session management & RBAC guards
│       ├── detection/             # URL parser, 10+ signals, brand matcher, risk scorer
│       ├── threat-intel/          # Multi-provider threat intelligence adapters
│       ├── ai/                    # Explainable threat reasoning engine
│       ├── audit/                 # Security audit logger
│       ├── pdf/                   # jsPDF report compilation service
│       └── db.ts                  # Prisma Client singleton
└── tests/                         # Vitest automated test suites
```

---

## 7. Security Safeguards & Limitations

- **Strict SSRF Protection**: The URL analysis engine performs structural, lexical, and algorithmic inspection purely on the submitted string without issuing outbound socket/HTTP connections to the target.
- **Explainable Heuristics**: Heuristic scores indicate elevated suspiciousness and pattern correlation rather than infallible proof of active compromise.
- **Provider Status Honesty**: If an external API key is omitted, the platform transparently marks the feed as `NOT_CONFIGURED` and falls back to local deterministic intelligence without fabricating third-party scan results.

---

## 8. License
Built for educational and defensive cybersecurity operations hackathons.
=======
# OPTIMUS
An evidence-driven Digital Risk Protection Platform for detecting suspicious URLs, identifying potential brand impersonation, integrating threat intelligence, and assessing digital risks through explainable scoring, AI-powered insights, and incident investigation.
>>>>>>> 5ee7f74f73e77930240d4cb96c31e59696aa2374
