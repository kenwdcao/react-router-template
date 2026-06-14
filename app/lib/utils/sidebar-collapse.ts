/**
 * Cookie-backed persistence for the dashboard desktop sidebar collapse state.
 *
 * The cookie is the SSR-readable source of truth so the server-rendered shell
 * and the first client render agree on the collapsed width (no expand→collapse
 * flash on refresh). This mirrors the theme-cookie helpers in `./theme.ts`.
 *
 * The legacy `localStorage` key used the same name (`dashboard-sidebar-collapsed`).
 * `migrateSidebarCollapsedFromLocalStorage` seeds the cookie once for existing
 * users without ever touching render state, so migration cannot cause a flash.
 */

export const SIDEBAR_COLLAPSE_COOKIE_NAME = "dashboard-sidebar-collapsed";
const LEGACY_LOCAL_STORAGE_KEY = "dashboard-sidebar-collapsed";

export const DEFAULT_SIDEBAR_COLLAPSED = false;

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
 * Parse the sidebar collapse cookie. Only the literal `"true"` collapses the
 * sidebar; `"false"`, missing, or any other value leaves it expanded.
 */
export function parseSidebarCollapsedCookie(
  cookieHeader: string | null,
): boolean {
  const value = parseCookieValue(cookieHeader, SIDEBAR_COLLAPSE_COOKIE_NAME);
  return value === "true" ? true : DEFAULT_SIDEBAR_COLLAPSED;
}

function buildCookie(cookieName: string, value: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${cookieName}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

/** Build a `Set-Cookie` value for the sidebar collapse preference. */
export function buildSidebarCollapsedCookie(collapsed: boolean): string {
  return buildCookie(SIDEBAR_COLLAPSE_COOKIE_NAME, String(collapsed));
}

/**
 * One-time, non-flickering migration of the legacy `localStorage` preference
 * into the cookie. Runs client-side only.
 *
 * - If the cookie is already present, do nothing (cookie is authoritative).
 * - Otherwise read the legacy `localStorage` value once and, when it is a valid
 *   boolean string, seed the cookie so the preference takes effect on the next
 *   server render. This never mutates render state, so it cannot cause a flash
 *   on the current load.
 */
export function migrateSidebarCollapsedFromLocalStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (document.cookie.includes(`${SIDEBAR_COLLAPSE_COOKIE_NAME}=`)) {
    return;
  }

  let legacy: string | null = null;
  try {
    legacy = window.localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
  } catch {
    // localStorage may be unavailable (e.g. privacy mode); nothing to migrate.
    return;
  }

  if (legacy === "true" || legacy === "false") {
    document.cookie = buildSidebarCollapsedCookie(legacy === "true");
  }
}
