import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "~/lib/db";
import { env } from "~/lib/env.server";

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

const pool =
  globalForDb.pool ?? new Pool({ connectionString: env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
});

export { pool };
