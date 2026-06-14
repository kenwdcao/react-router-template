/**
 * Cookie-backed persistence for the dashboard AI chat sidebar.
 *
 * Two independent booleans are stored as cookies:
 *   - `dashboard-chat-open`     — whether the aside is visible
 *   - `dashboard-chat-expanded` — whether the aside renders at the wider width
 *
 * The cookies are the SSR-readable source of truth so the server-rendered
 * shell and the first client render agree on the aside state (no flash on
 * refresh). This mirrors the sidebar-collapse helpers in `./sidebar-collapse.ts`.
 */

export const CHAT_OPEN_COOKIE_NAME = "dashboard-chat-open";
export const CHAT_EXPANDED_COOKIE_NAME = "dashboard-chat-expanded";

export const DEFAULT_CHAT_OPEN = false;
export const DEFAULT_CHAT_EXPANDED = false;

function parseCookieValue(cookieHeader: string | null, cookieName: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!cookie) {
    return null;
  }

  try {
    return decodeURIComponent(cookie.slice(cookieName.length + 1));
  } catch {
    return null;
  }
}

/**
 * Parse the chat-open cookie. Only the literal `"true"` opens the aside;
 * `"false"`, missing, or any other value leaves it closed.
 */
export function parseChatOpenCookie(cookieHeader: string | null): boolean {
  const value = parseCookieValue(cookieHeader, CHAT_OPEN_COOKIE_NAME);
  return value === "true" ? true : DEFAULT_CHAT_OPEN;
}

/**
 * Parse the chat-expanded cookie. Only the literal `"true"` widens the aside.
 */
export function parseChatExpandedCookie(cookieHeader: string | null): boolean {
  const value = parseCookieValue(cookieHeader, CHAT_EXPANDED_COOKIE_NAME);
  return value === "true" ? true : DEFAULT_CHAT_EXPANDED;
}

function buildCookie(cookieName: string, value: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${cookieName}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

/** Build a `Set-Cookie` value for the chat-open preference. */
export function buildChatOpenCookie(open: boolean): string {
  return buildCookie(CHAT_OPEN_COOKIE_NAME, String(open));
}

/** Build a `Set-Cookie` value for the chat-expanded preference. */
export function buildChatExpandedCookie(expanded: boolean): string {
  return buildCookie(CHAT_EXPANDED_COOKIE_NAME, String(expanded));
}
