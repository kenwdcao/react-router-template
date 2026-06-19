# Project Instructions

This is a full-stack React Router v8 template using React 19, TypeScript,
Mantine v9, Tailwind CSS v4, PostgreSQL, Prisma migrations, Kysely runtime
queries, better-auth, Vite, Vitest, Playwright, ESLint, and Prettier.

## Commands

- Install dependencies with `pnpm install`.
- Use Node.js 24.11+ locally; `.nvmrc`, `.node-version`, Docker, and CI are aligned on Node 24.11+.
- Start local PostgreSQL with `pnpm db:up`.
- Apply development migrations with `pnpm db:migrate`.
- Regenerate Kysely database types with `pnpm db:generate`.
- Start the dev server with `pnpm dev`.
- Validate changes with the narrowest relevant command first, then broaden when needed: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm test:e2e`.

## Workflow

- Create a working branch before making code changes. Do not work directly on `main`.
- Keep `main` history linear. Prefer fast-forward or squash-style integration and avoid local merge commits on `main`.
- Use concise conventional commit messages such as `feat:`, `fix:`, `docs:`, `refactor:`, and `test:` when creating commits.
- All commit messages, code comments, and PR/MR titles and descriptions must be written in English.
- Run `pnpm format` or the narrower Prettier command before committing when formatting may have changed.

## Template Initialization

1. Run the initialize skill using `.agents/skills/initialize` for guided scaffolding.
2. Collect project details before editing any files:
   a. Product name, package name, and purpose
   b. User roles and auth requirements
   c. Initial route map
   d. Core domain entities
   e. Branding basics
   f. Deployment target and required environment variables
   g. AI demo/assistant decision and provider requirements
3. Replace placeholders: swap `react-router-template`, `React Router Template`, welcome copy, and the sample `project` domain with project-specific names and workflows.
4. Decide whether to delete the sample CRUD, rename it into a real domain entity, or keep it as a documented example.
5. Decide whether the `/demo/dashboard` chat sidebar and `/api/chat` should be deleted, kept as an optional AI demo, or rewritten into a product-owned assistant.
6. Rewrite root `AGENTS.md` with actual product context, domain vocabulary, route/auth/data/AI rules, and validation expectations.
7. Update `README.md`, `.env.example`, route titles, navigation labels, tests, AI env docs, and sample data for consistency.

## Architecture

- Keep route modules in `app/routes` thin. Route modules should wire React Router `loader`, `action`, `meta`, default component, and `ErrorBoundary` exports to focused functions in `app/lib`.
- Global providers, document shell, fonts, and root-level pending UI belong in `app/root.tsx`.
- Section-level UI belongs in nested layout routes such as `marketing`, `auth`, and `demo/dashboard`.
- Put shared domain logic in `app/lib`; keep presentational React components in `app/ui`.
- Use the `~/*` path alias for imports from `app`.

## React Router

- Use framework-mode route types from the generated `+types` directory: `import type { Route } from "./+types/<route-name>"`.
- Use server `loader` functions for data needed during SSR and navigation.
- Use server `action` functions for route mutations.
- Use `<Form method="get">` for search/filter forms that should update URL search params.
- Use `<Form method="post">` for mutations that intentionally navigate or redirect after submit.
- Use `useFetcher` for inline mutations that should not navigate away from the current route.
- Reuse `requireAuth(request)` in every loader/action that reads or mutates user-owned data, even when the parent layout is protected.
- Throw `Response` objects or redirects from loaders/actions for route-level failures. Render route-specific failures in `ErrorBoundary`.

## TypeScript

- The project is strict TypeScript. Do not weaken `tsconfig.json` or introduce broad `any` types to bypass errors.
- Prefer inferred return types for simple local functions, but export explicit types when they form a shared contract.
- Use `import type` for type-only imports.
- Preserve discriminated unions and literal constants for form intents, statuses, and other finite option sets.
- Use `unknown` plus narrowing or type guards instead of `any`.
- Avoid type assertions. When an assertion is necessary, keep it narrow and add a short comment explaining why it is safe.
- Handle nullable values explicitly with optional chaining or `??` fallbacks.
- Validate untrusted inputs at the boundary. Existing examples use Zod for environment validation and explicit form parsing for route actions.
- Do not hand-edit generated files such as `.react-router/**` or `app/lib/db/database-types.ts`.
- `pnpm-workspace.yaml` is present only for pnpm build approvals, not because this is a monorepo.

## Styling

- Mantine owns interactive components, forms, overlays, notifications, AppShell, and theme-aware component props.
- Reference Mantine's documentation index at https://mantine.dev/llms.txt when working with Mantine components, props, and theming.
- Tailwind owns page-level composition, simple layout utilities, spacing between plain elements, and one-off responsive grid/flex structure.
- Avoid inline styles. ESLint enforces this with local rules.
- Use `lucide-react` for icons. Do not add another icon library.
- Icon-only controls need accessible names through visible labels or `aria-label`.
- Browser-native `alert`, `confirm`, and `prompt` are forbidden for product UI flows. Use Mantine modal/dialog patterns instead.

## Data And Auth

- Prisma owns schema and migrations under `prisma`.
- Kysely owns runtime SQL queries from `app/lib/db/server.ts` and typed query modules in `app/lib`.
- better-auth owns the authentication tables in the Prisma schema. Be careful when changing `user`, `session`, `account`, and `verification`.
- Keep server-only database and auth code out of client components.
- Do not expose password hashes, raw provider tokens, or other server-only internals through loader data or action responses.

## AI Demo And Assistant

- AI configuration is optional. The `/demo/dashboard` chat sidebar and `/api/chat` are demo surfaces and should stay in setup/disabled mode unless `AI_BASE_URL`, `AI_API_KEY`, and `AI_MODEL_ID` are present in the server environment.
- Keep AI provider creation, model selection, and API keys in server-only modules and environment variables. Do not expose `AI_API_KEY`, provider tokens, or secret-bearing prompts through loader data, action responses, client components, or logs.
- During real-project initialization, explicitly decide whether to delete the AI demo, keep it as documented example code, or rewrite it into a product-owned assistant; align `README.md`, `AGENTS.md`, `.env.example`, routes/navigation, and tests with that decision.

## Testing

### Unit And Component Tests

- Use Vitest and React Testing Library for non-trivial `app/lib` logic and reusable `app/ui` components.
- Test behavior, not implementation details.
- Focus on user interactions, business logic, validation, error handling, and permission logic.
- Do not add tests for pure rendering, styles, or framework behavior that this app does not own.

### E2E Tests

- Use Playwright for critical user journeys and user-visible routing changes.
- Cover complete flows such as register/login -> route action -> redirected or verified result.
- Add or update E2E coverage when changing authentication, navigation, protected layouts, or critical forms.

### Testing Workflow

- Keep complex loader/action logic in `app/lib` so it can be unit tested without rendering a route.
- Update tests during template initialization when app name, navigation labels, routes, auth behavior, or the sample project domain changes.
- Do not commit generated test artifacts such as `test-results/` or `playwright-report/`.

## Dependency Notes

- ESLint remains on the latest v9.x release because the current React/JSX plugin stack is not yet compatible with ESLint v10:
  - `eslint-plugin-react@7.37.5` calls `context.getFilename()`, which was removed in ESLint 10 ([jsx-eslint/eslint-plugin-react#3979](https://github.com/jsx-eslint/eslint-plugin-react/issues/3979)).
  - `eslint-plugin-jsx-a11y@6.10.2` declares `eslint: ^9` only ([jsx-eslint/eslint-plugin-jsx-a11y#1075](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/1075)).
  - `eslint-config-mantine@4.0.3` depends on both of the above and requires `eslint: ^9.9.1`.
- The local `eslint-rules/max-file-lines.js` rule has been updated to use `context.filename` directly so it is ready for ESLint 10.
- Re-evaluate the ESLint 10 upgrade when the upstream plugins publish compatible versions or when the project decides to migrate to `@eslint-react/eslint-plugin`.
