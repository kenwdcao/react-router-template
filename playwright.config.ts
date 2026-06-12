import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

const port = Number(process.env.PORT ?? 5173);
const baseURL = `http://127.0.0.1:${port}`;

function resolveE2EDatabaseURL(): string {
  if (process.env.E2E_DATABASE_URL) {
    return process.env.E2E_DATABASE_URL;
  }

  if (process.env.CI && process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    url.pathname = "/app_test";
    return url.toString();
  }

  return "postgresql://app:password@localhost:5432/app_test";
}

const databaseURL = resolveE2EDatabaseURL();

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  workers: process.env.CI ? 1 : 2,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    // Start only the app — not `pnpm dev`, which tears down and recreates Postgres.
    command: `react-router dev --host 127.0.0.1 --port ${port}`,
    env: {
      BETTER_AUTH_SECRET:
        process.env.BETTER_AUTH_SECRET ??
        "local-e2e-secret-at-least-thirty-two-chars",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? baseURL,
      BETTER_AUTH_TRUSTED_ORIGINS:
        process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? baseURL,
      DATABASE_URL: databaseURL,
    },
    reuseExistingServer: false,
    url: baseURL,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
