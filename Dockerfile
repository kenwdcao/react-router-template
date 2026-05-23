# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS development-dependencies-env
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
WORKDIR /app
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile --fetch-retries=5 --store-dir=/pnpm/store

FROM node:22-alpine AS production-dependencies-env
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
WORKDIR /app
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile --prod --ignore-scripts --fetch-retries=5 --store-dir=/pnpm/store

FROM node:22-alpine AS build-env
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
# Build-time env values satisfy server environment validation. The build does
# not connect to this database URL.
RUN DATABASE_URL=postgresql://app:password@localhost:5432/app_build \
  BETTER_AUTH_SECRET=build-secret-at-least-thirty-two-characters \
  BETTER_AUTH_URL=http://localhost:3000 \
  pnpm run build

FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["pnpm", "run", "start"]
