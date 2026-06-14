export function readFormString(
  formData: FormData,
  key: string,
  options?: { trim?: boolean },
): string {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return options?.trim === false ? value : value.trim();
}

export function readFormStringArray(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string");
}

/**
 * Parse an integer query param, falling back when the value is missing or not a
 * finite integer. Guards against `NaN` from `parseInt("abc")` propagating into
 * DB pagination or page math.
 */
export function parseIntegerParam(
  value: string | null | undefined,
  fallback: number,
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}
