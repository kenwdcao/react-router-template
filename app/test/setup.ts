import "@testing-library/jest-dom/vitest";

process.env.DATABASE_URL ??=
  "postgresql://app:password@localhost:5432/app_test";
process.env.BETTER_AUTH_SECRET ??= "test-secret-at-least-thirty-two-characters";
process.env.BETTER_AUTH_URL ??= "http://localhost:5173";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
