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
- Regenerate Kysely database types with `pnpm db:generate`.
- Start the dev server with `pnpm dev`.
- Validate with the narrowest relevant command first, then broaden with
  `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and
  `pnpm test:e2e`.

## Workflow

- Create a working branch before making code changes. Do not work directly on
  `main`.
- Keep `main` history linear. Prefer fast-forward or squash-style integration
  and avoid local merge commits on `main`.
- Use concise conventional commit messages such as `feat:`, `fix:`, `docs:`,
  `refactor:`, and `test:`.
- Run `pnpm format` or the narrower Prettier command before committing when
  formatting may have changed.

## Architecture

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

- Use `requireAuth(request)` in every loader/action that reads or mutates
  user-owned data.
- Scope database reads and writes by authenticated user id or explicit role.
- Keep Prisma responsible for schema and migrations, and Kysely responsible for
  runtime SQL queries.
- Keep better-auth-owned tables compatible with the auth integration.
- Do not expose password hashes, provider tokens, or server-only internals.

## Testing

- Add Vitest coverage for non-trivial `app/lib` logic.
- Add Playwright coverage when changing user-visible routing, auth, navigation,
  or critical forms.
- Prefer observable behavior over implementation details.
- Do not commit generated test artifacts such as `test-results/` or
  `playwright-report/`.
