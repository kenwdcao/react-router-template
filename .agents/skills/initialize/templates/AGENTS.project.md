# Project Instructions

> Initialization markers:
>
> - `[REPLACE]` Fill with product-specific names, routes, entities, and
>   workflows.
> - `[KEEP]` Preserve unless the stack changes. These rules encode the template
>   architecture and safety constraints.
> - `[OPTIONAL]` Delete or rewrite after deciding whether the sample project CRUD
>   remains part of the product.

This project is a [REPLACE: PRODUCT_NAME] application for
[REPLACE: PRIMARY_USERS]. It uses React Router framework mode, React,
TypeScript, Mantine, Tailwind CSS, PostgreSQL, Prisma migrations, Kysely
queries, better-auth, Vitest, Playwright, ESLint, and Prettier.

## Product Context

- Purpose: [REPLACE: ONE_SENTENCE_PURPOSE]
- Primary users: [REPLACE: USER_ROLES]
- Core workflows: [REPLACE: CORE_WORKFLOWS]
- Core domain entities: [REPLACE: DOMAIN_ENTITIES]
- Route map: [REPLACE: ROUTE_MAP]
- Auth model: [REPLACE: PUBLIC_ROUTES, AUTHENTICATED_ROUTES, ROLES]
- Deployment target: [REPLACE: PLATFORM_AND_DATABASE]

## Template Decisions

- [OPTIONAL] Sample project CRUD:
  [REPLACE: deleted, renamed to DOMAIN_ENTITY, or kept as documented example].
- [OPTIONAL] Demo seed data:
  [REPLACE: remove, rename, or adapt `prisma/seed.ts` to the real domain].
- [OPTIONAL] AI assistant/demo:
  [REPLACE: remove, keep as optional `/dashboard/chat` demo, or convert into a
  real assistant; document provider env vars if kept].
- [REPLACE] Branding:
  [PRODUCT_NAME], navigation labels, page titles, metadata, and empty states.

## Commands

[KEEP]

- Install dependencies with `pnpm install`.
- Start local PostgreSQL with `pnpm db:up`.
- Apply development migrations with `pnpm db:migrate`.
- Regenerate Kysely database types with `pnpm db:generate`.
- Seed local demo data with `pnpm db:seed` when useful.
- Start the dev server with `pnpm dev`.
- Validate with the narrowest relevant command first, then broaden with
  `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and
  `pnpm test:e2e`.

## Workflow

[KEEP]

- Create a working branch before making code changes. Do not work directly on
  `main`.
- Keep `main` history linear. Prefer fast-forward or squash-style integration
  and avoid local merge commits on `main`.
- Use concise conventional commit messages such as `feat:`, `fix:`, `docs:`,
  `refactor:`, and `test:`.
- Run `pnpm format` or the narrower Prettier command before committing when
  formatting may have changed.

## Architecture

[KEEP]

- Keep route modules in `app/routes` thin.
- Move non-trivial data loading, form parsing, validation, auth checks, and
  persistence to focused modules under `app/lib`.
- Global providers, document shell, fonts, and root pending UI belong in
  `app/root.tsx`.
- Section-level UI belongs in nested layout routes such as `marketing`, `auth`,
  and `dashboard`.
- Keep shared presentational components in `app/ui`.
- Use `~/*` imports for code under `app`.
- Keep generated files out of manual edits.

## React Router

[KEEP]

- Use framework-mode route types from generated `+types` directories:
  `import type { Route } from "./+types/<route-name>"`.
- Use server `loader` functions for SSR/navigation data and server `action`
  functions for route mutations.
- Use `<Form method="get">` for URL-backed filters and `<Form method="post">`
  for mutations that intentionally navigate or redirect.
- Use `useFetcher` for inline mutations that should not navigate away.
- Reuse `requireAuth(request)` in every loader/action that reads or mutates
  user-owned data, even when the parent layout is protected.
- Throw `Response` objects or redirects from loaders/actions for route-level
  failures and render route-specific failures in `ErrorBoundary`.

## TypeScript

[KEEP]

- Keep TypeScript strict. Do not weaken `tsconfig.json` or introduce broad
  `any` types to bypass errors.
- Use `import type` for type-only imports.
- Preserve discriminated unions and literal constants for form intents,
  statuses, and finite option sets.
- Use `unknown` plus narrowing or type guards instead of `any`.
- Avoid type assertions. When one is necessary, keep it narrow and document why
  it is safe.
- Validate untrusted inputs at the boundary and handle nullable values
  explicitly.
- Do not hand-edit `.react-router/**` or `app/lib/db/database-types.ts`.

## Styling

[KEEP]

- Mantine owns interactive components, forms, overlays, notifications,
  AppShell, and theme-aware component props.
- Tailwind owns page composition, simple layout utilities, spacing, and
  one-off responsive grid/flex structure.
- Avoid inline styles.
- Use `lucide-react` for icons. Do not add another icon library.
- Icon-only controls need accessible names through visible labels or
  `aria-label`.
- Browser-native `alert`, `confirm`, and `prompt` are forbidden for product UI
  flows. Use Mantine modal/dialog patterns instead.

## Auth And Data

[KEEP]

- Use `requireAuth(request)` in every loader/action that reads or mutates
  user-owned data.
- Scope database reads and writes by authenticated user id or explicit role.
- Keep Prisma responsible for schema and migrations, and Kysely responsible for
  runtime SQL queries.
- Keep better-auth-owned tables compatible with the auth integration.
- Do not expose password hashes, provider tokens, or server-only internals.

## AI Assistant

[OPTIONAL]

- If kept or converted, AI provider configuration is optional and server-only.
  Document `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL_ID` in `.env.example`
  with safe placeholders.
- Never expose AI keys, provider tokens, or secret-bearing prompts through
  loader data, action responses, client components, or logs.
- If removed or converted, keep README, AGENTS, env docs, route labels,
  navigation, tests, and assistant knowledge aligned with that decision.

## Testing

[KEEP]

- Add Vitest coverage for non-trivial `app/lib` logic.
- Add Playwright coverage when changing user-visible routing, auth, navigation,
  or critical forms.
- Prefer observable behavior over implementation details.
- Do not commit generated test artifacts such as `test-results/` or
  `playwright-report/`.

## Initialization Checklist

- [REPLACE] Replace package/app names in `package.json`, route metadata,
  navigation, README, and visible UI copy.
- [REPLACE] Update `.env.example` with deployment-specific required variables
  and safe placeholders.
- [REPLACE] Rename or remove `project` domain files, tests, route labels, and
  seed data if the sample CRUD is not part of the product.
- [REPLACE] Record the AI demo decision and align README, AGENTS,
  `.env.example`, route/navigation labels, and tests.
- [KEEP] Re-run `pnpm db:generate` after schema changes and commit generated
  database types only when the schema changed.
- [KEEP] Finish with `pnpm format:check`, `pnpm lint`, `pnpm typecheck`,
  `pnpm test`, and any relevant `pnpm test:e2e` flow.
