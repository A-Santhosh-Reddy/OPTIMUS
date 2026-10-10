import { PrismaClient } from "@prisma/client";

/**
 * Sanitizes connection URIs:
 * 1. Encodes special characters in passwords if unencoded.
 * 2. Replaces connection_limit=1 with connection_limit=10 to avoid connection pool exhaustion
 *    when parallel telemetry queries execute on serverless platforms like Vercel.
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

  // Prevent connection starvation on Supabase / PostgreSQL poolers
  if (url.includes("connection_limit=1&") || url.endsWith("connection_limit=1")) {
    url = url.replace("connection_limit=1", "connection_limit=10&pool_timeout=20");
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
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
