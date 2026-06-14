import { describe, expect, it } from "vitest";
import {
  CHAT_EXPANDED_COOKIE_NAME,
  CHAT_OPEN_COOKIE_NAME,
  DEFAULT_CHAT_EXPANDED,
  DEFAULT_CHAT_OPEN,
  buildChatExpandedCookie,
  buildChatOpenCookie,
  parseChatExpandedCookie,
  parseChatOpenCookie,
} from "~/lib/utils";

describe("chat-open cookie parsing", () => {
  it("reads open=true from a cookie header", () => {
    expect(parseChatOpenCookie("dashboard-chat-open=true")).toBe(true);
  });

  it("reads open=false from a cookie header", () => {
    expect(parseChatOpenCookie("dashboard-chat-open=false")).toBe(false);
  });

  it("reads the value when other cookies are present", () => {
    const cookieHeader = [
      "mantine-color-scheme=dark",
      "dashboard-chat-open=true",
      "session=abc",
    ].join("; ");

    expect(parseChatOpenCookie(cookieHeader)).toBe(true);
  });

  it("falls back to the default when the cookie is missing", () => {
    expect(parseChatOpenCookie(null)).toBe(DEFAULT_CHAT_OPEN);
    expect(parseChatOpenCookie("")).toBe(DEFAULT_CHAT_OPEN);
    expect(parseChatOpenCookie("mantine-color-scheme=dark")).toBe(
      DEFAULT_CHAT_OPEN,
    );
  });

  it("falls back to the default when the value is invalid", () => {
    expect(parseChatOpenCookie("dashboard-chat-open=maybe")).toBe(
      DEFAULT_CHAT_OPEN,
    );
  });
});

describe("chat-expanded cookie parsing", () => {
  it("reads expanded=true from a cookie header", () => {
    expect(parseChatExpandedCookie("dashboard-chat-expanded=true")).toBe(true);
  });

  it("reads expanded=false from a cookie header", () => {
    expect(parseChatExpandedCookie("dashboard-chat-expanded=false")).toBe(
      false,
    );
  });

  it("reads the value when other cookies are present", () => {
    const cookieHeader = [
      "mantine-color-scheme=dark",
      "dashboard-chat-expanded=true",
      "dashboard-chat-open=true",
    ].join("; ");

    expect(parseChatExpandedCookie(cookieHeader)).toBe(true);
  });

  it("falls back to the default when the cookie is missing", () => {
    expect(parseChatExpandedCookie(null)).toBe(DEFAULT_CHAT_EXPANDED);
    expect(parseChatExpandedCookie("")).toBe(DEFAULT_CHAT_EXPANDED);
    expect(parseChatExpandedCookie("dashboard-chat-open=true")).toBe(
      DEFAULT_CHAT_EXPANDED,
    );
  });

  it("falls back to the default when the value is invalid", () => {
    expect(parseChatExpandedCookie("dashboard-chat-expanded=maybe")).toBe(
      DEFAULT_CHAT_EXPANDED,
    );
  });
});

describe("chat cookie building", () => {
  it("builds an open=true cookie", () => {
    const cookie = buildChatOpenCookie(true);

    expect(cookie).toContain(`${CHAT_OPEN_COOKIE_NAME}=true`);
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Max-Age=31536000");
  });

  it("builds an open=false cookie", () => {
    expect(buildChatOpenCookie(false)).toContain(
      `${CHAT_OPEN_COOKIE_NAME}=false`,
    );
  });

  it("builds an expanded=true cookie", () => {
    const cookie = buildChatExpandedCookie(true);

    expect(cookie).toContain(`${CHAT_EXPANDED_COOKIE_NAME}=true`);
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("Max-Age=31536000");
  });

  it("builds an expanded=false cookie", () => {
    expect(buildChatExpandedCookie(false)).toContain(
      `${CHAT_EXPANDED_COOKIE_NAME}=false`,
    );
  });
});
