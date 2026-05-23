# React Router Template

A full-stack React Router v7 starter with SSR, Mantine v9, Tailwind CSS v4, PostgreSQL, Prisma migrations, Kysely queries, better-auth, Vite, Vitest, Playwright, Docker, and CI.

## Getting Started

Install dependencies:

```bash
node --version              # Use Node.js 22; see .nvmrc and .node-version.
pnpm install
```

Create local environment variables:

```bash
cp .env.example .env
openssl rand -base64 32
```

Paste the generated secret into `BETTER_AUTH_SECRET`, then start PostgreSQL and run migrations:

```bash
pnpm db:up
pnpm db:migrate
pnpm db:generate
pnpm db:seed
pnpm dev
```

The application runs at `http://localhost:5173`. The seed creates
`demo@example.com` with password `DemoPassword123!` and a pair of sample
projects. Override the seed account with `SEED_USER_EMAIL`, `SEED_USER_NAME`,
and `SEED_USER_PASSWORD` when needed.

Playwright uses a separate `app_test` database by default so browser tests do
not mutate development data. Create it once, apply migrations against it, then
run E2E tests:

```bash
docker exec -it "$(docker compose ps -q postgres)" createdb -U app app_test
DATABASE_URL="postgresql://app:password@localhost:5432/app_test" pnpm db:migrate:deploy
pnpm test:e2e
```

## Initializing A Real Project

This repository is intended to be copied and then adapted before feature work
starts. When using an Agent, start with the local `.agents/skills/initialize`
skill so it gathers product-specific details and updates the template in one
coherent pass.

The initialization pass should cover:

- Project name, package name, product purpose, primary user roles, and route map.
- Auth requirements, deployment target, environment variables, and branding.
- Whether the sample project CRUD should be removed, renamed into the real
  domain, or kept as an example.
- Updates to `AGENTS.md`, `README.md`, `.env.example`, route titles, navigation,
  tests, and sample domain code.

## Included Patterns

- `app/routes.ts` demonstrates layout routes for marketing, auth, and protected dashboard sections.
- `app/routes/health.ts` provides a lightweight health-check resource route.
- `app/lib/auth/require-auth.server.ts` provides `requireAuth`, `requireAnonymous`, and safe redirect handling.
- `app/routes/auth/login.tsx` and `app/routes/auth/register.tsx` use React Router actions for form submission.
- `app/routes/dashboard/projects.tsx` shows a protected loader, action mutations, route-level errors, and Kysely-backed CRUD.
- `app/lib/env.server.ts` validates required server environment variables with Zod before DB or auth setup.
- `prisma/seed.ts` creates an idempotent better-auth demo account and sample owner-scoped projects.
- `.github/workflows/ci.yml` runs migrations, generated types, lint, typecheck, unit tests, build, and Playwright.

## Routing Layouts

The template keeps global providers in `app/root.tsx` and puts section UI in nested layout routes:

- Marketing layout: public pages with a compact header.
- Auth layout: sign-in and registration pages without the app header.
- Dashboard layout: authenticated pages with sidebar navigation and a route guard.

Add new protected pages under the `dashboard` route so the layout loader guards the section. Still call `requireAuth(request)` in actions or loaders that access user-owned data.

## Data And Forms

Prisma owns migrations in `prisma/migrations`, while Kysely owns runtime queries from `app/lib/db/server.ts`.

Use this default pattern for server data:

```tsx
export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuth(request);
  return listProjectsForUser(session.user.id);
}

export async function action({ request }: Route.ActionArgs) {
  const session = await requireAuth(request);
  const formData = await request.formData();
  // validate and mutate with Kysely
}
```

Use `<Form method="post">` for route submissions and `useFetcher` for inline mutations that should not navigate.

## Styling Convention

Mantine owns interactive components, forms, overlays, notifications, AppShell, and theme-aware component props. Tailwind owns page-level composition, simple layout utilities, spacing between plain elements, and one-off responsive grid/flex structure.

Avoid inline styles. Prefer Mantine props for component styling and Tailwind classes for layout-only wrappers.

## Scripts

```bash
pnpm dev                  # React Router dev server
pnpm build                # Production build
pnpm start                # Serve build output
pnpm lint                 # ESLint with local project rules
pnpm typecheck            # React Router typegen + TypeScript
pnpm test                 # Vitest unit/component tests
pnpm test:e2e             # Playwright browser tests
pnpm db:up                # Start local PostgreSQL
pnpm db:down              # Stop local PostgreSQL
pnpm db:migrate           # Create/apply development migrations
pnpm db:migrate:deploy    # Apply migrations in CI/production
pnpm db:generate          # Generate Kysely database types
pnpm db:seed              # Seed a demo user and sample projects
```

## Docker

```bash
docker build -t react-router-template .
```

For a full local container stack, start Postgres, apply migrations from the host
through the published database port, then start the app container:

```bash
docker compose up -d postgres
DATABASE_URL="postgresql://app:password@localhost:5432/app_dev" pnpm db:migrate:deploy
docker compose up --build app
```

The compose app service uses the internal `postgres` hostname. For standalone
`docker run`, set `DATABASE_URL` to an external database reachable from inside
the container, such as a managed Postgres instance or a host database exposed to
Docker.

## Deploying To Production

See [docs/deployment.md](docs/deployment.md) for required environment variables,
HTTPS and proxy guidance, migration order, health checks, and database backup
expectations.
