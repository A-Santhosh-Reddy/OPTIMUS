import { PrismaClient } from "@prisma/client";

/**
 * Sanitizes and optimizes database connection URIs:
 * 1. Encodes special characters in passwords if unencoded.
 * 2. Tunes connection_limit and pool_timeout for Supabase / PostgreSQL poolers to avoid starvation.
 * 3. Ensures pgbouncer=true is present when connecting through port 6543.
 */
export function sanitizeDatabaseUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return rawUrl;
  let url = rawUrl;

  if (url.startsWith("mysql://")) {
    const atCount = (url.match(/@/g) || []).length;
    if (atCount > 1) {
      const lastAtIndex = url.lastIndexOf("@");
      const userPassPart = url.substring("mysql://".length, lastAtIndex);
      const hostPart = url.substring(lastAtIndex + 1);

      const firstColon = userPassPart.indexOf(":");
      if (firstColon !== -1) {
        const user = userPassPart.substring(0, firstColon);
        const pass = userPassPart.substring(firstColon + 1);
        const encodedPass = encodeURIComponent(decodeURIComponent(pass));
        url = `mysql://${user}:${encodedPass}@${hostPart}`;
      }
    }
  }

  // Optimize Supabase / PostgreSQL pooler connection parameters
  if (url.includes(".pooler.supabase.com:6543") && !url.includes("pgbouncer=true")) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}pgbouncer=true`;
  }

  if (url.includes("connection_limit=1&") || url.endsWith("connection_limit=1")) {
    url = url.replace("connection_limit=1", "connection_limit=10&pool_timeout=30");
  }

  return url;
}

const sanitizedDbUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);
if (sanitizedDbUrl && sanitizedDbUrl !== process.env.DATABASE_URL) {
  process.env.DATABASE_URL = sanitizedDbUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: sanitizedDbUrl ? { db: { url: sanitizedDbUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Resilient query wrapper that automatically retries transient connection drops or pool timeouts.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 2,
  delayMs = 400
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || "";
      const isConnectionIssue =
        msg.includes("connection") ||
        msg.includes("closed") ||
        msg.includes("timeout") ||
        msg.includes("P1001") ||
        msg.includes("P1002") ||
        msg.includes("P1017") ||
        msg.includes("P2024") ||
        msg.includes("ECONNRESET") ||
        msg.includes("Can't reach database server");

      if (attempt < maxRetries && isConnectionIssue) {
        console.warn(
          `[Prisma / Supabase] Transient connection dropped (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delayMs}ms...`
        );
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
