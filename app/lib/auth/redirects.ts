export function getSafeRedirectTo(
  redirectTo: FormDataEntryValue | string | null,
  fallback = "/",
) {
  if (typeof redirectTo !== "string") {
    return fallback;
  }

  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback;
  }

  return redirectTo;
}
