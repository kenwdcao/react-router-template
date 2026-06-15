/**
 * Cookie-backed persistence for the admin desktop sidebar collapse state.
 *
 * Mirrors `./sidebar-collapse.ts` (the dashboard equivalent): the cookie is the
 * SSR-readable source of truth so the server-rendered shell and the first
 * client render agree on the collapsed width (no expand→collapse flash on
 * refresh). There is no legacy `localStorage` key here because the admin
 * sidebar is brand new.
 */

export const ADMIN_SIDEBAR_COLLAPSE_COOKIE_NAME = "admin-sidebar-collapsed";

export const DEFAULT_ADMIN_SIDEBAR_COLLAPSED = false;

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
 * Parse the admin sidebar collapse cookie. Only the literal `"true"` collapses
 * the sidebar; `"false"`, missing, or any other value leaves it expanded.
 */
export function parseAdminSidebarCollapsedCookie(
  cookieHeader: string | null,
): boolean {
  const value = parseCookieValue(
    cookieHeader,
    ADMIN_SIDEBAR_COLLAPSE_COOKIE_NAME,
  );
  return value === "true" ? true : DEFAULT_ADMIN_SIDEBAR_COLLAPSED;
}

function buildCookie(cookieName: string, value: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${cookieName}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

/** Build a `Set-Cookie` value for the admin sidebar collapse preference. */
export function buildAdminSidebarCollapsedCookie(collapsed: boolean): string {
  return buildCookie(ADMIN_SIDEBAR_COLLAPSE_COOKIE_NAME, String(collapsed));
}
