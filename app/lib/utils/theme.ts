import type {
  ColorScheme,
  PrimaryColor,
  ResolvedColorScheme,
} from "~/lib/types/theme";

export const PRIMARY_COLOR_COOKIE_NAME = "mantine-primary-color";
export const COLOR_SCHEME_COOKIE_NAME = "mantine-color-scheme";
export const RESOLVED_COLOR_SCHEME_COOKIE_NAME =
  "mantine-resolved-color-scheme";
export const PRIMARY_COLOR_VALUES = [
  "blue",
  "teal",
  "pink",
  "violet",
] as const satisfies readonly PrimaryColor[];
export const COLOR_SCHEME_VALUES = [
  "light",
  "dark",
  "auto",
] as const satisfies readonly ColorScheme[];
export const RESOLVED_COLOR_SCHEME_VALUES = [
  "light",
  "dark",
] as const satisfies readonly ResolvedColorScheme[];
export const DEFAULT_COLOR_SCHEME = "auto" as const satisfies ColorScheme;
export const DEFAULT_RESOLVED_COLOR_SCHEME =
  "light" as const satisfies ResolvedColorScheme;
export const DEFAULT_PRIMARY_COLOR = PRIMARY_COLOR_VALUES[0];
export const PRIMARY_COLOR_LABELS: Record<PrimaryColor, string> = {
  blue: "Default",
  teal: "Teal",
  pink: "Pink",
  violet: "Violet",
};

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

export function isPrimaryColor(
  value: string | null | undefined,
): value is PrimaryColor {
  return (
    typeof value === "string" &&
    (PRIMARY_COLOR_VALUES as readonly string[]).includes(value)
  );
}

export function isColorScheme(
  value: string | null | undefined,
): value is ColorScheme {
  return (
    typeof value === "string" &&
    (COLOR_SCHEME_VALUES as readonly string[]).includes(value)
  );
}

export function isResolvedColorScheme(
  value: string | null | undefined,
): value is ResolvedColorScheme {
  return (
    typeof value === "string" &&
    (RESOLVED_COLOR_SCHEME_VALUES as readonly string[]).includes(value)
  );
}

export function parsePrimaryColorCookie(
  cookieHeader: string | null,
): PrimaryColor {
  const value = parseCookieValue(cookieHeader, PRIMARY_COLOR_COOKIE_NAME);
  return isPrimaryColor(value) ? value : DEFAULT_PRIMARY_COLOR;
}

export function parseColorSchemeCookie(
  cookieHeader: string | null,
): ColorScheme {
  const value = parseCookieValue(cookieHeader, COLOR_SCHEME_COOKIE_NAME);
  return isColorScheme(value) ? value : DEFAULT_COLOR_SCHEME;
}

export function parseResolvedColorSchemeCookie(
  cookieHeader: string | null,
): ResolvedColorScheme {
  const value = parseCookieValue(
    cookieHeader,
    RESOLVED_COLOR_SCHEME_COOKIE_NAME,
  );
  return isResolvedColorScheme(value) ? value : DEFAULT_RESOLVED_COLOR_SCHEME;
}

function buildCookie(cookieName: string, value: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${cookieName}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

export function buildPrimaryColorCookie(color: PrimaryColor): string {
  return buildCookie(PRIMARY_COLOR_COOKIE_NAME, color);
}

export function buildColorSchemeCookie(colorScheme: ColorScheme): string {
  return buildCookie(COLOR_SCHEME_COOKIE_NAME, colorScheme);
}

export function buildResolvedColorSchemeCookie(
  colorScheme: ResolvedColorScheme,
): string {
  return buildCookie(RESOLVED_COLOR_SCHEME_COOKIE_NAME, colorScheme);
}
