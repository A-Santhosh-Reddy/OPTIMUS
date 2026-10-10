import postgres from "postgres";

const connectionString =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/postgres";

// Re-use connection in Next.js development mode to avoid leaking connection pools
const globalForSql = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
};

export const sql =
  globalForSql.sql ??
  postgres(connectionString, {
    ssl: "require",
    max: 10,
  });

if (process.env.NODE_ENV !== "production") globalForSql.sql = sql;

export default sql;
