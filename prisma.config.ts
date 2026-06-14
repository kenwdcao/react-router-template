import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Copy .env.example to .env and fill it in.",
  );
}

// Shadow database used by `prisma migrate dev`/`migrate diff` to detect schema
// drift. Points at a throwaway database alongside the dev DB. Preserve any
// query parameters (e.g. `?sslmode=require`) when swapping the database name,
// so production/staging connection options are kept.
//
// We explicitly verify the fallback actually changed the path: a DATABASE_URL
// without a terminal database name would otherwise leave the shadow URL equal
// to the primary URL, silently pointing migrations at the real database.
const fallbackShadowDatabaseUrl = databaseUrl.replace(
  /\/([^/?]+)(\?.*)?$/,
  "/app_shadow$2",
);
const shadowDatabaseUrl =
  process.env.SHADOW_DATABASE_URL ??
  (fallbackShadowDatabaseUrl !== databaseUrl
    ? fallbackShadowDatabaseUrl
    : undefined);

if (!shadowDatabaseUrl) {
  throw new Error(
    "Could not derive SHADOW_DATABASE_URL from DATABASE_URL " +
      "(no terminal database path to replace). Set SHADOW_DATABASE_URL explicitly.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
    shadowDatabaseUrl,
  },
});
