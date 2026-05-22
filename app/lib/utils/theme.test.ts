import { describe, expect, it } from "vitest";
import {
  DEFAULT_COLOR_SCHEME,
  DEFAULT_PRIMARY_COLOR,
  buildColorSchemeCookie,
  parseColorSchemeCookie,
  parsePrimaryColorCookie,
} from "~/lib/utils";

describe("theme cookies", () => {
  it("reads known theme values from a cookie header", () => {
    const cookieHeader = [
      "mantine-primary-color=teal",
      "mantine-color-scheme=dark",
    ].join("; ");

    expect(parsePrimaryColorCookie(cookieHeader)).toBe("teal");
    expect(parseColorSchemeCookie(cookieHeader)).toBe("dark");
  });

  it("falls back when cookies are missing or invalid", () => {
    expect(parsePrimaryColorCookie("mantine-primary-color=orange")).toBe(
      DEFAULT_PRIMARY_COLOR,
    );
    expect(parseColorSchemeCookie(null)).toBe(DEFAULT_COLOR_SCHEME);
  });

  it("builds persistent same-site cookies", () => {
    expect(buildColorSchemeCookie("dark")).toContain(
      "mantine-color-scheme=dark",
    );
    expect(buildColorSchemeCookie("dark")).toContain("SameSite=Lax");
  });
});
