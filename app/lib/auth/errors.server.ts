export function getAuthErrorMessage(error: unknown, fallback: string): string {
  console.error("[auth]", error);
  return fallback;
}
