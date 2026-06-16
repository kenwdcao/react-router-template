import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Force the React development build under Vitest. The production React
  // bundle does not export `act`, which @testing-library/react requires, so
  // every component test fails with `TypeError: React.act is not a function`
  // when NODE_ENV is left at "production".
  define: {
    "process.env.NODE_ENV": JSON.stringify("test"),
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./app/test/setup.ts"],
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
    passWithNoTests: true,
    coverage: {
      exclude: ["app/lib/db/database-types.ts", "app/test/**", "e2e/**"],
    },
  },
});
