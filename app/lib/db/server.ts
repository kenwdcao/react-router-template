import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "~/db/database-types";

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

const pool =
  globalForDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({ pool }),
});

export { pool };
