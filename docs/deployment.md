# Deployment Guide

This template builds to a React Router server bundle that can run behind a
reverse proxy, in Docker, or on any Node-compatible platform with PostgreSQL.

## Required Environment

Set these variables in production:

- `DATABASE_URL`: PostgreSQL connection string reachable from the app runtime.
- `BETTER_AUTH_SECRET`: at least 32 random characters. Generate with
  `openssl rand -base64 32`.
- `BETTER_AUTH_URL`: public HTTPS origin for the deployed app, for example
  `https://app.example.com`.
- `BETTER_AUTH_TRUSTED_ORIGINS`: comma-separated origins allowed to submit auth
  requests. Include the public HTTPS origin and any private preview origins.
- `APP_PORT`: container or Node listening port when using the provided Docker
  entrypoint.

Keep `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `POSTGRES_PORT`
for local compose workflows only unless production Postgres is also managed by
your deployment stack.

## Release Order

1. Build and publish the app image or server artifact.
2. Apply migrations against the production database with
   `pnpm db:migrate:deploy`.
3. Start the app with `pnpm start` or the provided Docker image.
4. Verify `/health`, the root page, and a protected auth flow.

Run `pnpm db:seed` only in disposable development or preview databases. The
default seed creates a known demo credential and should not be used for
production customer data.

## HTTPS And Proxies

Terminate HTTPS before traffic reaches the Node process. Caddy, nginx, a cloud
load balancer, or the hosting platform can own TLS. Forward these headers so
auth callbacks and logging see the public request shape:

- `Host`
- `X-Forwarded-Proto`
- `X-Forwarded-Host`
- `X-Forwarded-For`

Set `BETTER_AUTH_URL` and `BETTER_AUTH_TRUSTED_ORIGINS` to the external HTTPS
origin, not the internal container hostname.

## Health And Operations

- Use `/health` as the HTTP health check target. It is intentionally lightweight
  and does not require database access.
- Monitor migration failures, auth error rates, database connection saturation,
  and server process restarts.
- Back up PostgreSQL before every release that includes schema migrations.
- Test restore procedures on a non-production database before relying on the
  backups.
