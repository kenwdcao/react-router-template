# [PRODUCT_NAME]

[ONE_SENTENCE_PURPOSE]

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm db:migrate
pnpm db:generate
pnpm dev
```

The application runs at `http://localhost:5173`.

## Product Shape

- Users: [PRIMARY_USERS]
- Core workflows: [CORE_WORKFLOWS]
- Core entities: [DOMAIN_ENTITIES]

## Environment

Document required variables here with safe placeholder values. Never commit
real secrets.

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
```
