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

describe("requireAuth", () => {
  it("returns the current session", async () => {
    const session = createMockSession();
    getSession.mockResolvedValueOnce(session);

    await expect(
      requireAuth(new Request("http://localhost:5173/demo/dashboard")),
    ).resolves.toBe(session);
  });

  it("redirects anonymous users to /login, preserving the requested path", async () => {
    // The redirectTo is the normalized pathname (url.pathname from the loader),
    // not request.url — which under v8 pass-through requests would otherwise
    // carry a `.data` suffix on data requests.
    getSession.mockResolvedValueOnce(null);

    const result = await requireAuth(
      new Request("http://localhost:5173/demo/dashboard/projects"),
      "/demo/dashboard/projects",
    ).then(
      () => "unexpectedly resolved",
      (error: unknown) => error,
    );

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(302);
    expect((result as Response).headers.get("Location")).toBe(
      `/login?redirectTo=${encodeURIComponent("/demo/dashboard/projects")}`,
    );
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
    expect(getSafeRedirectTo("/demo/dashboard/projects")).toBe(
      "/demo/dashboard/projects",
    );
    expect(getSafeRedirectTo("https://example.com")).toBe("/");
    expect(getSafeRedirectTo("//example.com")).toBe("/");
  });
});
