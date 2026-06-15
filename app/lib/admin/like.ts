/**
 * Escape special LIKE/ILIKE pattern characters (`%`, `_`, `\`) so a user-provided
 * search term is matched literally. Pair with `ilike ... escape '\\'` in the
 * query that consumes the result.
 */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

/** Wrap a search term as an ILIKE `%term%` fragment, escaped and ready to bind. */
export function buildLikeFragment(value: string): string {
  return `%${escapeLikePattern(value)}%`;
}
