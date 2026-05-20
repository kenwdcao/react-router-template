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

## Auth Tables

- The `user`, `session`, `account`, and `verification` models are used by
  better-auth.
- Do not rename or reshape better-auth fields unless the auth integration is
  updated and verified at the same time.
- Preserve cascade behavior for auth-owned relations unless the data retention
  requirement explicitly changes.

## Migration Hygiene

- Review generated SQL before committing it.
- Do not manually edit migration history to hide mistakes after it has been
  shared. Add a new corrective migration instead.
- Keep migrations deterministic and environment-independent.
- Validate DB changes with at least `pnpm db:migrate`, `pnpm db:generate`, and
  `pnpm typecheck`.
