# Prisma Instructions

This directory owns database schema and migrations.

## Ownership

- Prisma owns the schema in `schema.prisma` and migration files in
  `migrations/**`.
- Kysely owns runtime queries outside this directory.
- Do not hand-edit generated runtime types in `app/lib/db/database-types.ts`.
  Regenerate them with `pnpm db:generate`.

## Schema Changes

- Update `schema.prisma` first, then create a migration with
  `pnpm db:migrate`.
- After any schema or migration change, run `pnpm db:generate` so the Prisma
  client and Kysely database types match the schema.
- Keep column defaults, nullability, indexes, uniqueness, and relations explicit.
- Prefer additive migrations when possible. Treat destructive migrations as
  product decisions that need clear intent.
- Use PostgreSQL-compatible types and preserve existing `@db.Timestamptz(6)`
  timestamp precision unless there is a reason to change it.
- Commit schema changes, generated migration folders, and regenerated database
  types together.

## Auth Tables

- The `user`, `session`, `account`, and `verification` models are used by
  better-auth.
- Do not rename or reshape better-auth fields unless the auth integration is
  updated and verified at the same time.
- Preserve cascade behavior for auth-owned relations unless the data retention
  requirement explicitly changes.

## Migration Hygiene

- Review generated SQL before committing it.
- Do not hand-write `migration.sql`. Let `pnpm db:migrate` generate migration
  SQL from `schema.prisma`.
- Do not manually edit migration history to hide mistakes after it has been
  shared or applied. Add a new corrective migration instead.
- Do not modify migration SQL in response to review feedback. Fix
  `schema.prisma` and generate a forward migration instead.
- Do not use `prisma db push` on the main development database; it bypasses
  migration history and causes drift.
- Keep migrations deterministic and environment-independent.
- Validate DB changes with at least `pnpm db:migrate`, `pnpm db:generate`, and
  `pnpm typecheck`.

## Recovery

- For local-only, not-yet-shared migrations, it is acceptable to delete the
  migration folder and reset the local database before regenerating.
- Never reset shared, staging, or production databases to repair migration drift.
- Use Prisma migration status/resolve commands only after verifying the database
  schema actually matches the migration state.
