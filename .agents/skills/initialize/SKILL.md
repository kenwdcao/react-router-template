---
name: initialize
description: Convert this React Router template into a project-specific starter. Use when the user asks to initialize, customize, bootstrap, rebrand, rename, or adapt the template for a real product, including updating root AGENTS.md, README.md, package metadata, branding, route examples, auth choices, environment docs, and validation.
---

# Initialize Project

## Overview

Use this skill to turn the generic React Router template into a concrete
project starting point while preserving the template's architecture, validation
commands, and Agent-facing guardrails.

## Workflow

1. Confirm the repo root and current branch. Create a working branch before
   edits if the user has not already done so.
2. Check whether the repo is still template-shaped by looking for placeholder
   names such as `react-router-template`, `React Router Template`, the welcome page, and the sample `project` domain.
3. Gather missing product details before editing. If the user already supplied
   enough context, proceed without asking.
4. Update project identity and documentation first, then code, schema, seed
   data, and tests.
5. Remove, rename, or adapt sample CRUD only after the replacement domain is
   clear.
6. Validate with the narrowest useful commands, then broaden as needed.

## Intake Questions

Ask only for details that are missing:

- Product name and package name.
- One-sentence product purpose and primary user roles.
- Initial route map: public pages, auth pages, protected app sections.
- Auth choice: email/password only, OAuth providers, or no auth.
- Core domain entities and whether the sample `project` model should be
  removed, renamed, or kept as an example.
- Whether demo seed data should be removed, renamed into the replacement
  domain, or kept for local onboarding.
- Branding basics: app title, primary color, tone, and any known navigation
  labels.
- Deployment target and required environment variables.
- Whether to keep CI, Docker, Playwright, and database defaults unchanged.

## Files To Update

Use `templates/AGENTS.project.md` and `templates/README.project.md` as structure
references, not as files to copy blindly.

Update these files when relevant:

- `package.json`: `name`, optional scripts, and package metadata.
- `README.md`: project-specific setup, domain summary, environment variables,
  and validation commands.
- `AGENTS.md`: replace template-level language with the actual product context,
  domain vocabulary, route/auth/data rules, and validation expectations.
- `.env.example`: project-specific variables with safe placeholder values.
- `app/lib/auth/server.ts`: `appName` and provider/plugin configuration.
- `app/routes/**`: route names, titles, navigation, and placeholder pages.
- `app/ui/**`: brand text, theme defaults, reusable components, and copy.
- `app/lib/projects.ts` and `app/lib/projects.server.ts`: rename the sample
  domain consistently, keeping shared constants separate from Kysely-derived
  result types.
- `prisma/schema.prisma`: domain models and relations, followed by migrations
  and regenerated Kysely types.
- `prisma/seed.ts`: remove, rename, or adapt demo users and sample domain data.
- `e2e/**` and `app/**/*.test.*`: update tests to match the initialized
  product behavior.

## Final Consistency Checklist

Before finishing initialization, verify these artifacts describe the same
product decisions:

- `README.md`, root `AGENTS.md`, `.env.example`, and `package.json` use the
  project name, package name, routes, environment variables, and validation
  commands consistently.
- Route titles, navigation labels, tests, seed/sample data, and domain copy no
  longer point at the generic template unless the sample CRUD was intentionally
  kept as an example.
- The sample CRUD decision is recorded: deleted, renamed into a real domain
  entity, or retained as documented example code.
- The seed-data decision is recorded and `pnpm db:seed` either matches the real
  domain or is removed from docs and package scripts.
- Domain result types have one source of truth. For the sample project domain,
  `ProjectSummary` is derived from `app/lib/projects.server.ts`; do not recreate
  a parallel interface in the shared constants module.
- CI, Docker, migration commands, and generated-type checks still match the
  chosen database and deployment path.
- Prisma migration ownership, Kysely runtime-query ownership, React Router route
  rules, TypeScript strictness, Mantine/Tailwind styling boundaries, and
  better-auth data-safety rules remain present in `AGENTS.md`.

## Code Rules

- Keep route modules thin. Move non-trivial loaders, actions, parsing,
  validation, and persistence into `app/lib`.
- Keep server-only auth and database code out of client components.
- Keep Mantine responsible for interactive UI and Tailwind responsible for page
  layout utilities.
- Do not weaken TypeScript, lint rules, auth ownership checks, or generated file
  boundaries.
- Do not hand-edit `.react-router/**` or `app/lib/db/database-types.ts`.

## Validation

Prefer this sequence:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

After schema changes, run:

```bash
pnpm db:migrate
pnpm db:generate
pnpm db:seed
pnpm typecheck
```

If validation cannot run because Docker, PostgreSQL, browsers, or secrets are
missing, report the exact blocker and the commands that remain.
