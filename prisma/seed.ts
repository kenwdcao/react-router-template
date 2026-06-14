import "dotenv/config";

import { hashPassword } from "better-auth/crypto";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "../app/lib/db/database-types";
import { PROJECT_STATUS } from "../app/lib/demo/projects";

const DEMO_EMAIL = process.env.SEED_USER_EMAIL ?? "demo@example.com";
const DEMO_NAME = process.env.SEED_USER_NAME ?? "Demo User";
const DEMO_PASSWORD = process.env.SEED_USER_PASSWORD ?? "DemoPassword123!";

const seedProjects = [
  {
    id: "seed-project-customer-portal",
    name: "Customer portal",
    description: "Track the public launch checklist and owner handoffs.",
    status: PROJECT_STATUS.active,
  },
  {
    id: "seed-project-internal-tools",
    name: "Internal tools refresh",
    description: "Archived example showing owner-scoped project history.",
    status: PROJECT_STATUS.archived,
  },
] as const;

function requireDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to seed the database.");
  }

  return databaseUrl;
}

async function upsertDemoUser(db: Kysely<DB>) {
  const now = new Date();

  await db
    .insertInto("user")
    .values({
      id: "seed-user-demo",
      name: DEMO_NAME,
      email: DEMO_EMAIL.toLowerCase(),
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflict((conflict) => conflict.column("email").doNothing())
    .execute();

  const user = await db
    .selectFrom("user")
    .select(["id", "email"])
    .where("email", "=", DEMO_EMAIL.toLowerCase())
    .executeTakeFirstOrThrow();

  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const account = await db
    .selectFrom("account")
    .select("id")
    .where("userId", "=", user.id)
    .where("providerId", "=", "credential")
    .executeTakeFirst();

  if (account) {
    await db
      .updateTable("account")
      .set({
        accountId: user.id,
        password: passwordHash,
        updatedAt: now,
      })
      .where("id", "=", account.id)
      .execute();
  } else {
    await db
      .insertInto("account")
      .values({
        id: `seed-account-${user.id}`,
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: passwordHash,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
        createdAt: now,
        updatedAt: now,
      })
      .execute();
  }

  return user;
}

async function upsertDemoProjects(db: Kysely<DB>, ownerId: string) {
  for (const project of seedProjects) {
    const now = new Date();

    await db
      .insertInto("project")
      .values({
        ...project,
        ownerId,
        createdAt: now,
        updatedAt: now,
      })
      .onConflict((conflict) =>
        conflict.column("id").doUpdateSet({
          ownerId,
          name: project.name,
          description: project.description,
          status: project.status,
          updatedAt: now,
        }),
      )
      .execute();
  }
}

async function main() {
  const pool = new Pool({ connectionString: requireDatabaseUrl() });
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
  });

  try {
    const user = await upsertDemoUser(db);
    await upsertDemoProjects(db, user.id);
    console.log(
      `Seeded demo account ${user.email} with ${seedProjects.length} projects.`,
    );
  } finally {
    await db.destroy();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
