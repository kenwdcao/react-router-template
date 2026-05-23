import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

const port = Number(process.env.PORT ?? 5173);
const baseURL = `http://127.0.0.1:${port}`;
const databaseURL =
  process.env.E2E_DATABASE_URL ??
  (process.env.CI ? process.env.DATABASE_URL : undefined) ??
  "postgresql://app:password@localhost:5432/app_test";

export default defineConfig({
  testDir: "./e2e",
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `pnpm dev --host 127.0.0.1 --port ${port}`,
    env: {
      BETTER_AUTH_SECRET:
        process.env.BETTER_AUTH_SECRET ??
        "local-e2e-secret-at-least-thirty-two-chars",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? baseURL,
      DATABASE_URL: databaseURL,
    },
    reuseExistingServer: !process.env.CI,
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
