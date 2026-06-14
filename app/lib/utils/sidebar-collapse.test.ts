import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_SIDEBAR_COLLAPSED,
  SIDEBAR_COLLAPSE_COOKIE_NAME,
  buildSidebarCollapsedCookie,
  migrateSidebarCollapsedFromLocalStorage,
  parseSidebarCollapsedCookie,
} from "~/lib/utils";

describe("sidebar collapse cookie parsing", () => {
  it("reads collapsed=true from a cookie header", () => {
    expect(
      parseSidebarCollapsedCookie("dashboard-sidebar-collapsed=true"),
    ).toBe(true);
  });

  it("reads collapsed=false from a cookie header", () => {
    expect(
      parseSidebarCollapsedCookie("dashboard-sidebar-collapsed=false"),
    ).toBe(false);
  });

  it("reads the value when other cookies are present", () => {
    const cookieHeader = [
      "mantine-color-scheme=dark",
      "dashboard-sidebar-collapsed=true",
      "session=abc",
    ].join("; ");

    expect(parseSidebarCollapsedCookie(cookieHeader)).toBe(true);
  });

  it("falls back to the default when the cookie is missing", () => {
    expect(parseSidebarCollapsedCookie(null)).toBe(DEFAULT_SIDEBAR_COLLAPSED);
    expect(parseSidebarCollapsedCookie("")).toBe(DEFAULT_SIDEBAR_COLLAPSED);
    expect(parseSidebarCollapsedCookie("mantine-color-scheme=dark")).toBe(
      DEFAULT_SIDEBAR_COLLAPSED,
    );
  });

  it("falls back to the default when the value is invalid", () => {
    expect(
      parseSidebarCollapsedCookie("dashboard-sidebar-collapsed=maybe"),
    ).toBe(DEFAULT_SIDEBAR_COLLAPSED);
  });
});

describe("sidebar collapse cookie building", () => {
  it("builds a collapsed=true cookie", () => {
    const cookie = buildSidebarCollapsedCookie(true);

    expect(cookie).toContain(`${SIDEBAR_COLLAPSE_COOKIE_NAME}=true`);
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Max-Age=31536000");
  });

  it("builds a collapsed=false cookie", () => {
    expect(buildSidebarCollapsedCookie(false)).toContain(
      `${SIDEBAR_COLLAPSE_COOKIE_NAME}=false`,
    );
  });
});

describe("migrateSidebarCollapsedFromLocalStorage", () => {
  afterEach(() => {
    document.cookie = `${SIDEBAR_COLLAPSE_COOKIE_NAME}=; Path=/; Max-Age=0`;
    window.localStorage.clear();
  });

  it("seeds the cookie from a true localStorage preference when the cookie is absent", () => {
    window.localStorage.setItem("dashboard-sidebar-collapsed", "true");

    migrateSidebarCollapsedFromLocalStorage();

    expect(document.cookie).toContain(`${SIDEBAR_COLLAPSE_COOKIE_NAME}=true`);
  });

  it("seeds the cookie from a false localStorage preference when the cookie is absent", () => {
    window.localStorage.setItem("dashboard-sidebar-collapsed", "false");

    migrateSidebarCollapsedFromLocalStorage();

    expect(document.cookie).toContain(`${SIDEBAR_COLLAPSE_COOKIE_NAME}=false`);
  });

  it("does not overwrite the cookie when it is already present", () => {
    document.cookie = buildSidebarCollapsedCookie(true);
    window.localStorage.setItem("dashboard-sidebar-collapsed", "false");

    migrateSidebarCollapsedFromLocalStorage();

    // Cookie stays true; localStorage false is ignored.
    expect(document.cookie).toContain(`${SIDEBAR_COLLAPSE_COOKIE_NAME}=true`);
  });

  it("does nothing when localStorage has no preference", () => {
    migrateSidebarCollapsedFromLocalStorage();

    expect(document.cookie).not.toContain(SIDEBAR_COLLAPSE_COOKIE_NAME);
  });

  it("does nothing when localStorage holds an invalid value", () => {
    window.localStorage.setItem("dashboard-sidebar-collapsed", "maybe");

    migrateSidebarCollapsedFromLocalStorage();

    expect(document.cookie).not.toContain(SIDEBAR_COLLAPSE_COOKIE_NAME);
  });
});
