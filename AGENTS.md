# Project Instructions

This is a full-stack React Router v7 template using React 19, TypeScript,
Mantine v9, Tailwind CSS v4, PostgreSQL, Prisma migrations, Kysely runtime
queries, better-auth, Vite, Vitest, Playwright, ESLint, and Prettier.

## Commands

- Install dependencies with `pnpm install`.
- Start local PostgreSQL with `pnpm db:up`.
- Apply development migrations with `pnpm db:migrate`.
- Regenerate Prisma client and Kysely database types with `pnpm db:generate`.
- Start the dev server with `pnpm dev`.
- Validate changes with the narrowest relevant command first, then broaden when
  needed: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and
  `pnpm test:e2e`.

## Workflow

- Create a working branch before making code changes. Do not work directly on
  `main`.
- Keep `main` history linear. Prefer fast-forward or squash-style integration
  and avoid local merge commits on `main`.
- Use concise conventional commit messages such as `feat:`, `fix:`, `docs:`,
  `refactor:`, and `test:` when creating commits.
- Run `pnpm format` or the narrower Prettier command before committing when
  formatting may have changed.

## Architecture

- Keep route modules in `app/routes` thin. Route modules should wire React Router
  `loader`, `action`, `meta`, default component, and `ErrorBoundary` exports to
  focused functions in `app/lib`.
- Global providers, document shell, fonts, and root-level pending UI belong in
  `app/root.tsx`.
- Section-level UI belongs in nested layout routes such as `marketing`, `auth`,
  and `dashboard`.
- Put shared domain logic in `app/lib`; keep presentational React components in
  `app/ui`.
- Use the `~/*` path alias for imports from `app`.

## React Router

- Use framework-mode route types from the generated `+types` directory:
  `import type { Route } from "./+types/<route-name>"`.
- Use server `loader` functions for data needed during SSR and navigation.
- Use server `action` functions for route mutations.
- Use `<Form method="get">` for search/filter forms that should update URL
  search params.
- Use `<Form method="post">` for mutations that intentionally navigate or
  redirect after submit.
- Use `useFetcher` for inline mutations that should not navigate away from the
  current route.
- Reuse `requireAuth(request)` in every loader/action that reads or mutates
  user-owned data, even when the parent layout is protected.
- Throw `Response` objects or redirects from loaders/actions for route-level
  failures. Render route-specific failures in `ErrorBoundary`.

## TypeScript

- The project is strict TypeScript. Do not weaken `tsconfig.json` or introduce
  broad `any` types to bypass errors.
- Prefer inferred return types for simple local functions, but export explicit
  types when they form a shared contract.
- Use `import type` for type-only imports.
- Preserve discriminated unions and literal constants for form intents, statuses,
  and other finite option sets.
- Use `unknown` plus narrowing or type guards instead of `any`.
- Avoid type assertions. When an assertion is necessary, keep it narrow and add a
  short comment explaining why it is safe.
- Handle nullable values explicitly with optional chaining or `??` fallbacks.
- Validate untrusted inputs at the boundary. Existing examples use Zod for
  environment validation and explicit form parsing for route actions.
- Do not hand-edit generated files such as `.react-router/**` or
  `app/lib/db/database-types.ts`.

## Styling

- Mantine owns interactive components, forms, overlays, notifications, AppShell,
  and theme-aware component props.
- Tailwind owns page-level composition, simple layout utilities, spacing between
  plain elements, and one-off responsive grid/flex structure.
- Avoid inline styles. ESLint enforces this with local rules.
- Use `lucide-react` for icons. Do not add another icon library.
- Icon-only controls need accessible names through visible labels or
  `aria-label`.
- Browser-native `alert`, `confirm`, and `prompt` are forbidden for product UI
  flows. Use Mantine modal/dialog patterns instead.

## Data And Auth

- Prisma owns schema and migrations under `prisma`.
- Kysely owns runtime SQL queries from `app/lib/db/server.ts` and typed query
  modules in `app/lib`.
- better-auth owns the authentication tables in the Prisma schema. Be careful
  when changing `user`, `session`, `account`, and `verification`.
- Keep server-only database and auth code out of client components.
- Do not expose password hashes, raw provider tokens, or other server-only
  internals through loader data or action responses.

## Testing

- Add or update Vitest coverage for non-trivial logic in `app/lib` and reusable
  components in `app/ui`.
- Add or update Playwright coverage when a change alters user-visible routing,
  authentication, navigation, or critical forms.
- Prefer testing observable behavior over implementation details.
