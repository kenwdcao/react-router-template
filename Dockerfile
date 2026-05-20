FROM node:22-alpine AS development-dependencies-env
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
COPY . /app
WORKDIR /app
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS production-dependencies-env
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
COPY ./package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --frozen-lockfile --prod

FROM node:22-alpine AS build-env
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
ENV DATABASE_URL=postgresql://app:password@localhost:5432/app_build
ENV BETTER_AUTH_SECRET=build-secret-at-least-thirty-two-characters
ENV BETTER_AUTH_URL=http://localhost:3000
RUN pnpm run build

FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
COPY ./package.json pnpm-lock.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["pnpm", "run", "start"]
