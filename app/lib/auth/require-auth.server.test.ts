import { describe, expect, it, vi } from "vitest";
import { getSafeRedirectTo } from "~/lib/auth";
import type { AuthSession } from "~/lib/auth/index.server";
import { auth, requireAnonymous, requireAuth } from "~/lib/auth/index.server";

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
    },
    user: {
      id: "user-id",
      email: "user@example.com",
      name: "User",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
    },
    ...overrides,
  } satisfies AuthSession;
}

describe("requireAuth", () => {
  it("returns the current session", async () => {
    const session = createMockSession();
    getSession.mockResolvedValueOnce(session);

    await expect(
      requireAuth(new Request("http://localhost:5173/dashboard")),
    ).resolves.toBe(session);
  });

  it("redirects anonymous users to login", async () => {
    getSession.mockResolvedValueOnce(null);

    await expect(
      requireAuth(new Request("http://localhost:5173/dashboard/projects")),
    ).rejects.toMatchObject({
      status: 302,
    });
  });
});

describe("requireAnonymous", () => {
  it("redirects signed-in users away from auth pages", async () => {
    getSession.mockResolvedValueOnce(createMockSession());

    await expect(
      requireAnonymous(new Request("http://localhost:5173/login")),
    ).rejects.toMatchObject({
      status: 302,
    });
  });
});

describe("getSafeRedirectTo", () => {
  it("accepts same-origin paths only", () => {
    expect(getSafeRedirectTo("/dashboard/projects")).toBe(
      "/dashboard/projects",
    );
    expect(getSafeRedirectTo("https://example.com")).toBe("/dashboard");
    expect(getSafeRedirectTo("//example.com")).toBe("/dashboard");
  });
});
