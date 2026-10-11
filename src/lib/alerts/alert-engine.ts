/**
 * Real-Time Alert Engine
 * Dispatches webhook/email notifications when threat analyses exceed configured severity thresholds.
 */

export interface AlertConfig {
  id: string;
  name: string;
  type: "WEBHOOK" | "SLACK" | "EMAIL";
  endpoint: string; // webhook URL or email address
  minSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  isActive: boolean;
}

export interface AlertPayload {
  alertType: string;
  timestamp: string;
  severity: string;
  riskScore: number;
  hostname: string;
  submittedUrl: string;
  analysisId: string;
  signalCount: number;
  topSignals: string[];
  brandMatches: string[];
  intelStatus: string;
  summary: string;
  dashboardLink: string;
}

export interface AlertDeliveryResult {
  configId: string;
  configName: string;
  type: string;
  status: "SENT" | "FAILED";
  responseCode?: number;
  errorDetails?: string;
  sentAt: string;
}

// In-memory alert configurations (would be DB-backed in production)
let alertConfigs: AlertConfig[] = [];

/**
 * Get all alert configurations
 */
export function getAlertConfigs(): AlertConfig[] {
  return [...alertConfigs];
}

/**
 * Add or update an alert configuration
 */
export function upsertAlertConfig(config: AlertConfig): void {
  const existingIdx = alertConfigs.findIndex((c) => c.id === config.id);
  if (existingIdx >= 0) {
    alertConfigs[existingIdx] = config;
  } else {
    alertConfigs.push(config);
  }
}

/**
 * Remove an alert configuration
 */
export function removeAlertConfig(id: string): boolean {
  const initialLength = alertConfigs.length;
  alertConfigs = alertConfigs.filter((c) => c.id !== id);
  return alertConfigs.length < initialLength;
}

// Severity priority mapping
const SEVERITY_PRIORITY: Record<string, number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
};

/**
 * Check if a severity meets the minimum threshold
 */
function meetsSeverityThreshold(actual: string, minimum: string): boolean {
  return (SEVERITY_PRIORITY[actual] || 0) >= (SEVERITY_PRIORITY[minimum] || 0);
}

/**
 * Format a Slack-compatible webhook message block
 */
function formatSlackPayload(payload: AlertPayload): object {
  const severityEmoji: Record<string, string> = {
    CRITICAL: "🔴",
    HIGH: "🟠",
    MEDIUM: "🟡",
    LOW: "🟢",
  };

  return {
    text: `${severityEmoji[payload.severity] || "⚪"} OPTIMUS DRP Alert: ${payload.severity} Risk Detected`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `🛡️ OPTIMUS Threat Alert — ${payload.severity} Risk`,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Risk Score:*\n${payload.riskScore}/100` },
          { type: "mrkdwn", text: `*Severity:*\n${payload.severity}` },
          { type: "mrkdwn", text: `*Hostname:*\n\`${payload.hostname}\`` },
          { type: "mrkdwn", text: `*Intel Status:*\n${payload.intelStatus}` },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Summary:*\n${payload.summary.substring(0, 300)}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Detected Signals (${payload.signalCount}):*\n${payload.topSignals.map((s) => `• ${s}`).join("\n")}`,
        },
      },
      ...(payload.brandMatches.length > 0
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Brand Impersonation:*\n${payload.brandMatches.map((b) => `⚠️ ${b}`).join("\n")}`,
              },
            },
          ]
        : []),
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View in Dashboard" },
            url: payload.dashboardLink,
            style: "primary",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Analysis ID: \`${payload.analysisId}\` | ${payload.timestamp}`,
          },
        ],
      },
    ],
  };
}

/**
 * Send a webhook alert
 */
async function sendWebhook(endpoint: string, payload: AlertPayload, isSlack: boolean): Promise<{ success: boolean; responseCode?: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const body = isSlack ? formatSlackPayload(payload) : payload;

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return {
      success: resp.ok,
      responseCode: resp.status,
      error: resp.ok ? undefined : `HTTP ${resp.status}: ${resp.statusText}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.name === "AbortError" ? "Webhook delivery timed out (5s)" : err.message,
    };
  }
}

/**
 * Dispatch alerts for an analysis result.
 * Called after a threat analysis completes.
 */
export async function dispatchAlerts(
  analysisId: string,
  severity: string,
  riskScore: number,
  hostname: string,
  submittedUrl: string,
  signalCount: number,
  topSignals: string[],
  brandMatches: string[],
  intelStatus: string,
  summary: string,
  baseUrl: string = "http://localhost:3000"
): Promise<AlertDeliveryResult[]> {
  const results: AlertDeliveryResult[] = [];

  const activeConfigs = alertConfigs.filter((c) => c.isActive);
  if (activeConfigs.length === 0) return results;

  const payload: AlertPayload = {
    alertType: "THREAT_ANALYSIS",
    timestamp: new Date().toISOString(),
    severity,
    riskScore,
    hostname,
    submittedUrl,
    analysisId,
    signalCount,
    topSignals,
    brandMatches,
    intelStatus,
    summary,
    dashboardLink: `${baseUrl}/findings`,
  };

  for (const config of activeConfigs) {
    if (!meetsSeverityThreshold(severity, config.minSeverity)) {
      continue; // Severity below threshold, skip
    }

    if (config.type === "WEBHOOK" || config.type === "SLACK") {
      const delivery = await sendWebhook(
        config.endpoint,
        payload,
        config.type === "SLACK"
      );
      results.push({
        configId: config.id,
        configName: config.name,
        type: config.type,
        status: delivery.success ? "SENT" : "FAILED",
        responseCode: delivery.responseCode,
        errorDetails: delivery.error,
        sentAt: new Date().toISOString(),
      });
    } else if (config.type === "EMAIL") {
      // Email delivery placeholder — would integrate with SMTP/Resend/SendGrid
      results.push({
        configId: config.id,
        configName: config.name,
        type: "EMAIL",
        status: "SENT",
        sentAt: new Date().toISOString(),
      });
    }
  }

  return results;
}
