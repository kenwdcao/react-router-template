# Route Instructions

This directory contains React Router framework-mode route modules and nested
layout routes.

## Route Module Shape

- Keep route modules thin. They should connect React Router exports to focused implementation in `app/lib` and render the route UI.
- Prefer these exports when needed: `meta`, `loader`, `action`, default component, and `ErrorBoundary`.
- Use generated route types from the route-local `+types` directory: `import type { Route } from "./+types/<route-name>"`.
- Use `Route.LoaderArgs`, `Route.ActionArgs`, `Route.ComponentProps`, and `Route.ErrorBoundaryProps` instead of hand-written route prop types.
- Keep route components readable. Extract route-local subcomponents in the same file when they are small; move reusable presentational components to `app/ui`.
- Form submissions must go through React Router actions. Do not use local `useState` plus manual `fetch` calls for normal route mutations.

## Route Organization

- Represent URL hierarchy with nested folders instead of long flat filenames when a route group grows.
- Use `layout.tsx` for parent routes that own a URL segment, load shared data, or provide `<Outlet />` context to child routes.
- Use `index.tsx` for a route group's default child page.
- Use `$paramName` folder or file names for dynamic URL segments.
- Keep standalone root-level pages, such as `home.tsx`, at the route root until they have a shared URL prefix.
- Update `app/routes.ts` when moving route files.
- Run `pnpm typecheck` after route reorganization so React Router regenerates and verifies route types.

## Layout Boundaries

- URL-bearing layouts belong under `app/routes/.../layout.tsx`.
- Pathless shared shells can use React Router `layout(...)` in `app/routes.ts` and should stay pure UI unless they intentionally become route modules.
- Route layouts must load their own required data instead of relying on props or parent loader side effects.
- Child routes should access parent layout contracts through typed outlet context when needed.

## Loading Data

- Use server `loader` functions for data needed during SSR and client navigation.
- Parse search params from `new URL(request.url)` inside loaders.
- Move non-trivial loading logic into focused functions under `app/lib`.
- Do not access the database directly from browser-only code.
- Parent and child loaders run in parallel, so do not rely on parent loader side effects for child route correctness.

## Actions And Forms

- Use server `action` functions for route mutations.
- Move non-trivial mutation logic, validation helpers, and persistence code into focused functions under `app/lib`.
- Validate action inputs before mutation. Prefer a schema when validation grows beyond simple field presence or finite enum checks.
- Use `<Form method="get">` for search/filter forms that should update URL search params.
- Use `<Form method="post">` when the mutation should navigate or redirect after completion.
- Use `useFetcher` for inline mutations that should preserve the current route and support independent pending state.
- Use explicit form intents such as `_intent` when one route action handles multiple mutations.

## Auth And Ownership

- Call `requireAuth(request)` in every loader/action that reads or mutates user-owned data, even under protected layouts such as `demo/dashboard`.
- Scope reads, updates, and deletes by authenticated user id in the server helper that performs the database query.
- Treat client-supplied ids, form fields, and search params as untrusted input.

## Navigation And Errors

- Use React Router `redirect` from loaders/actions after successful mutations or auth redirects.
- Throw `Response` objects for route-level failures such as 404 and 403.
- Render route-specific failures in `ErrorBoundary`.
- Keep pending UI tied to React Router navigation or fetcher state, not custom global flags.

## UI Boundaries

- Layout routes should own section-level shells such as marketing, auth, and `demo/dashboard` navigation.
- Route files may contain UI that is specific to that route.
- Shared controls, visual components, and theme-aware primitives belong in `app/ui`.
- Follow `app/ui/AGENTS.md` for component, Mantine, icon, and accessibility rules.
