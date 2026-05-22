# Library Instructions

This directory contains shared domain logic, utilities, types, database queries, and authentication helpers consumed by route modules and UI components.

## Organization

- Group related modules into subdirectories (e.g. `auth/`, `db/`, `types/`, `utils/`).
- Keep server-only modules (database connections, auth backends, action handlers) in files with the `.server.ts` suffix so React Router excludes them from the client bundle.
- Root-level files such as `env.server.ts` or `projects.server.ts` are standalone modules that do not belong to a subgroup; import them directly by file path.

## Barrel Exports

- Every subdirectory must expose its public API through an `index.ts` barrel file. Import from the folder path, e.g. `~/lib/types`, not from individual files.
- Keep barrel files thin: only re-export public symbols. Do not add runtime logic or side effects in `index.ts`.
- When adding a new public export to an existing folder, update the folder's `index.ts` so the export is discoverable through the barrel.

### Server-Only Modules

- Subdirectories that contain both client-safe and server-only files must provide two barrels:
  - `index.ts` exports **only** client-safe symbols.
  - `index.server.ts` exports **only** server-only symbols.
- Never import a `.server.ts` file into a non-server barrel. Doing so would cause the barrel to be pulled into the client bundle and break the build.
- Server code may import either barrel (`~/lib/auth` for shared helpers or `~/lib/auth/index.server` for server-only exports).

## Boundaries

- Do not import `~/lib/db/server` or any `.server.ts` module from browser-only code.
- Keep environment access inside server modules such as `~/lib/env.server`.
- Keep server-only database and auth code out of client components.
- Do not expose password hashes, raw provider tokens, or other server-only internals through loader data or action responses.

## Validation

- After adding or removing public exports, run `pnpm typecheck` to ensure barrels remain consistent with their consumers.
- Add or update unit tests when business logic, validation rules, or permission checks change.
