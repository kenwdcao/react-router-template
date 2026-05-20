import { describe, expect, it, vi } from "vitest";
import { getSafeRedirectTo } from "~/lib/auth/redirects";
import { requireAnonymous, requireAuth } from "~/lib/auth/require-auth.server";
import { auth } from "~/lib/auth/server";

vi.mock("~/lib/auth/server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

const getSession = vi.mocked(auth.api.getSession);

describe("requireAuth", () => {
  it("returns the current session", async () => {
    const session = {
      session: { id: "session-id" },
      user: { id: "user-id", email: "user@example.com", name: "User" },
    };
    getSession.mockResolvedValueOnce(session as never);

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
    getSession.mockResolvedValueOnce({
      session: { id: "session-id" },
      user: { id: "user-id", email: "user@example.com", name: "User" },
    } as never);

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
