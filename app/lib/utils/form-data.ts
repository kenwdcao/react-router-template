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
