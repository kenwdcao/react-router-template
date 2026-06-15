import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthSession } from "~/lib/auth/index.server";
import { auth } from "~/lib/auth/index.server";

// Mutable env state shared with the mocked ~/lib/env.server module. Hoisted so
// the mock factory (which runs at import time) closes over the same object.
const envState = vi.hoisted(() => ({ ADMIN_EMAILS: [] as string[] }));

vi.mock("~/lib/env.server", () => ({
  env: {
    get ADMIN_EMAILS() {
      return envState.ADMIN_EMAILS;
    },
  },
}));

vi.mock("~/lib/auth/server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const getSession = vi.mocked(auth.api.getSession);

function createMockSession(overrides?: Partial<AuthSession>): AuthSession {
  return {
    session: {
      id: "session-id",
      userId: "user-id",
      expiresAt: new Date(),
      token: "token",
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: "127.0.0.1",
      userAgent: "test",
      impersonatedBy: null,
    },
    user: {
      id: "user-id",
      email: "user@example.com",
      name: "User",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
    },
    ...overrides,
  } satisfies AuthSession;
}

beforeEach(() => {
  envState.ADMIN_EMAILS = [];
});

describe("isAdminEmail", () => {
  it("returns true for an allow-listed email (case-insensitive)", async () => {
    envState.ADMIN_EMAILS = ["admin@example.com"];
    const { isAdminEmail } = await import("~/lib/auth/require-admin.server");
    expect(isAdminEmail("admin@example.com")).toBe(true);
    expect(isAdminEmail("ADMIN@example.com")).toBe(true);
  });

  it("returns false when the list is empty", async () => {
    const { isAdminEmail } = await import("~/lib/auth/require-admin.server");
    expect(isAdminEmail("admin@example.com")).toBe(false);
  });
});

describe("requireAdmin", () => {
  it("returns the session for an admin email", async () => {
    envState.ADMIN_EMAILS = ["admin@example.com"];
    const session = createMockSession({
      user: { ...createMockSession().user, email: "admin@example.com" },
    });
    getSession.mockResolvedValueOnce(session);
    const { requireAdmin } = await import("~/lib/auth/require-admin.server");

    await expect(
      requireAdmin(new Request("http://localhost:5173/admin/users")),
    ).resolves.toBe(session);
  });

  it("throws a 403 for a signed-in non-admin", async () => {
    envState.ADMIN_EMAILS = ["admin@example.com"];
    getSession.mockResolvedValueOnce(createMockSession());
    const { requireAdmin } = await import("~/lib/auth/require-admin.server");

    await expect(
      requireAdmin(new Request("http://localhost:5173/admin/users")),
    ).rejects.toMatchObject({ status: 403 });
  });

  it("redirects anonymous users to login", async () => {
    envState.ADMIN_EMAILS = ["admin@example.com"];
    getSession.mockResolvedValueOnce(null);
    const { requireAdmin } = await import("~/lib/auth/require-admin.server");

    await expect(
      requireAdmin(new Request("http://localhost:5173/admin/users")),
    ).rejects.toMatchObject({ status: 302 });
  });
});
