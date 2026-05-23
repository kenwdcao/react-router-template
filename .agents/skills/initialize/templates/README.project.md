# [PRODUCT_NAME]

[ONE_SENTENCE_PURPOSE]

> Initialize this README by replacing bracketed placeholders with actual
> product language. Keep the stack, validation, and deployment sections unless
> the project intentionally changes those choices.

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm db:migrate
pnpm db:generate
pnpm db:seed
pnpm dev
```

The application runs at `http://localhost:5173`.

## Product Shape

- Users: [PRIMARY_USERS]
- Core workflows: [CORE_WORKFLOWS]
- Core entities: [DOMAIN_ENTITIES]
- Route map: [ROUTE_MAP]
- Auth model: [PUBLIC_ROUTES_AND_PROTECTED_AREAS]
- AI assistant: [REMOVE, KEEP_OPTIONAL_DEMO, or CONVERT_TO_PRODUCT_FEATURE]

## Template Adaptation

- Sample CRUD decision: [DELETE, RENAME_TO_DOMAIN_ENTITY, or KEEP_AS_EXAMPLE]
- Seed data decision: [REMOVE, RENAME_TO_DOMAIN_ENTITY, or KEEP_FOR_DEMO]
- AI demo decision:
  [REMOVE, KEEP_AS_OPTIONAL_DASHBOARD_CHAT_DEMO, or CONVERT_TO_REAL_ASSISTANT]
- Branding replacements: [PRODUCT_NAME], navigation labels, route titles,
  metadata, empty states, and tests.

## Environment

Document required variables with safe placeholder values. Never commit real
secrets.

- `DATABASE_URL`: [POSTGRES_CONNECTION_STRING]
- `BETTER_AUTH_SECRET`: [GENERATED_32_PLUS_CHARACTER_SECRET]
- `BETTER_AUTH_URL`: [PUBLIC_APP_ORIGIN]
- `BETTER_AUTH_TRUSTED_ORIGINS`: [COMMA_SEPARATED_ALLOWED_ORIGINS]

If the AI assistant is kept or converted, document server-only provider
variables with safe placeholders:

- `AI_BASE_URL`: [OPENAI_COMPATIBLE_PROVIDER_URL]
- `AI_MODEL_ID`: [MODEL_IDENTIFIER]
- `AI_API_KEY`: [SERVER_ONLY_PROVIDER_KEY]

Add product-specific variables here, including deployment-only settings and
third-party credentials.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm db:up
pnpm db:migrate
pnpm db:generate
pnpm db:seed
```

## Deployment

Describe the target platform, migration order, HTTPS/proxy setup, health check,
and database backup expectations. Start from `docs/deployment.md` if it remains
in the initialized project.

## Validation

Before merging initialization changes, run:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run `pnpm test:e2e` after PostgreSQL and browser dependencies are available.
