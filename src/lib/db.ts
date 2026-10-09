import { PrismaClient } from "@prisma/client";

/**
 * Sanitizes connection URIs (e.g. if a MySQL password contains an unencoded '@').
 * In URI formats: mysql://user:password@host:port/database
 * An unencoded '@' in the password splits the URI incorrectly in Prisma/Node.
 */
export function sanitizeDatabaseUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return rawUrl;

  if (rawUrl.startsWith("mysql://")) {
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
  }

  return rawUrl;
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
