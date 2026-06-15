import { describe, expect, it } from "vitest";
import {
  ADMIN_SIDEBAR_COLLAPSE_COOKIE_NAME,
  DEFAULT_ADMIN_SIDEBAR_COLLAPSED,
  buildAdminSidebarCollapsedCookie,
  parseAdminSidebarCollapsedCookie,
} from "~/lib/utils";

describe("admin sidebar collapse cookie parsing", () => {
  it("reads collapsed=true from a cookie header", () => {
    expect(
      parseAdminSidebarCollapsedCookie("admin-sidebar-collapsed=true"),
    ).toBe(true);
  });

  it("reads collapsed=false from a cookie header", () => {
    expect(
      parseAdminSidebarCollapsedCookie("admin-sidebar-collapsed=false"),
    ).toBe(false);
  });

  it("reads the value when other cookies are present", () => {
    const cookieHeader = [
      "mantine-color-scheme=dark",
      "admin-sidebar-collapsed=true",
      "session=abc",
    ].join("; ");

    expect(parseAdminSidebarCollapsedCookie(cookieHeader)).toBe(true);
  });

  it("falls back to the default when the cookie is missing", () => {
    expect(parseAdminSidebarCollapsedCookie(null)).toBe(
      DEFAULT_ADMIN_SIDEBAR_COLLAPSED,
    );
    expect(parseAdminSidebarCollapsedCookie("")).toBe(
      DEFAULT_ADMIN_SIDEBAR_COLLAPSED,
    );
    expect(parseAdminSidebarCollapsedCookie("mantine-color-scheme=dark")).toBe(
      DEFAULT_ADMIN_SIDEBAR_COLLAPSED,
    );
  });

  it("falls back to the default when the value is invalid", () => {
    expect(
      parseAdminSidebarCollapsedCookie("admin-sidebar-collapsed=maybe"),
    ).toBe(DEFAULT_ADMIN_SIDEBAR_COLLAPSED);
  });
});

describe("admin sidebar collapse cookie building", () => {
  it("builds a collapsed=true cookie", () => {
    const cookie = buildAdminSidebarCollapsedCookie(true);

    expect(cookie).toContain(`${ADMIN_SIDEBAR_COLLAPSE_COOKIE_NAME}=true`);
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Max-Age=31536000");
  });

  it("builds a collapsed=false cookie", () => {
    expect(buildAdminSidebarCollapsedCookie(false)).toContain(
      `${ADMIN_SIDEBAR_COLLAPSE_COOKIE_NAME}=false`,
    );
  });
});
