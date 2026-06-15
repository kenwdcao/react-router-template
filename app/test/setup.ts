import "@testing-library/jest-dom/vitest";

process.env.DATABASE_URL ??=
  "postgresql://app:password@localhost:5432/app_test";
process.env.BETTER_AUTH_SECRET ??= "test-secret-at-least-thirty-two-characters";
process.env.BETTER_AUTH_URL ??= "http://localhost:5173";
process.env.AI_BASE_URL ??= "http://localhost:11434";
process.env.AI_API_KEY ??= "test-key";
process.env.AI_MODEL_ID ??= "test-model";
process.env.ADMIN_EMAILS ??= "";

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

// jsdom lacks ResizeObserver, which Mantine's ScrollArea/AppShell rely on.
// Provide a noop so component tests that render the dashboard shell work.
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: ResizeObserver,
});
Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: ResizeObserver,
});
