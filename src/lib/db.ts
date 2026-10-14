import { PrismaClient } from "@prisma/client";

/**
 * Sanitizes and optimizes database connection URIs:
 * 1. Encodes special characters in passwords if unencoded.
 * 2. Automatically migrates from brittle transaction pooler (port 6543) to stable session pooler (port 5432).
 * 3. Tunes connection_limit and pool_timeout to avoid starvation in serverless and concurrent environments.
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

  // If using Supabase transaction pooler (6543), migrate to session pooler (5432)
  // because port 6543 frequently resets idle connections with wsarecv / socket closed errors
  if (url.includes(".pooler.supabase.com:6543")) {
    if (process.env.DIRECT_URL && process.env.DIRECT_URL.includes(".pooler.supabase.com:5432")) {
      url = process.env.DIRECT_URL;
    } else {
      url = url.replace(":6543", ":5432")
               .replace("pgbouncer=true&", "")
               .replace("&pgbouncer=true", "")
               .replace("?pgbouncer=true", "?");
    }
  }

  // Ensure reasonable connection limits and timeouts for high availability
  if (url.includes("connection_limit=1&") || url.endsWith("connection_limit=1")) {
    url = url.replace("connection_limit=1", "connection_limit=10&pool_timeout=30");
  } else if (!url.includes("connection_limit=")) {
    const sep = url.includes("?") ? "&" : "?";
    url = `${url}${sep}connection_limit=10&pool_timeout=30`;
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

// Retain Prisma Client across warm serverless invocations on Vercel and local dev
globalForPrisma.prisma = db;

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
        msg.includes("wsarecv") ||
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
