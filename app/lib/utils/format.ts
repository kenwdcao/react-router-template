/**
 * Native-Intl date formatters for admin surfaces. Output mirrors the reference
 * project's dayjs-based helpers ("MMM D, YYYY" and "MMM D, YYYY, h:mm A") so no
 * new dependency is required.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
});

/** Format a date as "Jun 14, 2026". */
export function formatDate(date: Date): string {
  return DATE_FORMATTER.format(date);
}

/** Format a date as "Jun 14, 2026, 5:32 PM". */
export function formatDateTime(date: Date): string {
  return DATE_TIME_FORMATTER.format(date);
}
