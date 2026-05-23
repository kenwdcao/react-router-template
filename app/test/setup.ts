import "@testing-library/jest-dom/vitest";

process.env.DATABASE_URL ??=
  "postgresql://app:password@localhost:5432/app_test";
process.env.BETTER_AUTH_SECRET ??= "test-secret-at-least-thirty-two-characters";
process.env.BETTER_AUTH_URL ??= "http://localhost:5173";
process.env.AI_BASE_URL ??= "http://localhost:11434";
process.env.AI_API_KEY ??= "test-key";
process.env.AI_MODEL_ID ??= "test-model";

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
