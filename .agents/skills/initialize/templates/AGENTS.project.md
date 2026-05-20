# Project Instructions

This project is a [PRODUCT_NAME] application for [PRIMARY_USERS]. It uses React
Router framework mode, React, TypeScript, Mantine, Tailwind CSS, PostgreSQL,
Prisma migrations, Kysely queries, better-auth, Vitest, Playwright, ESLint, and
Prettier.

## Product Context

- Purpose: [ONE_SENTENCE_PURPOSE]
- Primary users: [USER_ROLES]
- Core workflows: [CORE_WORKFLOWS]
- Core domain entities: [DOMAIN_ENTITIES]

## Commands

- Install dependencies with `pnpm install`.
- Start local PostgreSQL with `pnpm db:up`.
- Apply development migrations with `pnpm db:migrate`.
- Regenerate Prisma client and Kysely database types with `pnpm db:generate`.
- Start the dev server with `pnpm dev`.
- Validate with the narrowest relevant command first, then broaden with
  `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and
  `pnpm test:e2e`.

## Architecture

- Keep route modules in `app/routes` thin.
- Move non-trivial data loading, form parsing, validation, auth checks, and
  persistence to focused modules under `app/lib`.
- Keep shared presentational components in `app/ui`.
- Use `~/*` imports for code under `app`.
- Keep generated files out of manual edits.

## Auth And Data

- Use `requireAuth(request)` in every loader/action that reads or mutates
  user-owned data.
- Scope database reads and writes by authenticated user id or explicit role.
- Keep better-auth-owned tables compatible with the auth integration.
- Do not expose password hashes, provider tokens, or server-only internals.

## Testing

- Add Vitest coverage for non-trivial `app/lib` logic.
- Add Playwright coverage when changing user-visible routing, auth, navigation,
  or critical forms.
- Prefer observable behavior over implementation details.
