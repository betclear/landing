export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function todayISODate(): string {
  return toISODate(new Date());
}

export function yesterdayISODate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return toISODate(date);
}

export function formatDisplayDate(
  isoDate: string,
  locale?: string,
): string {
  const date = parseISODate(isoDate);
  if (!date) return isoDate;

  const resolvedLocale =
    locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-GB");

  return new Intl.DateTimeFormat(resolvedLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function isFutureISODate(isoDate: string): boolean {
  return isoDate > todayISODate();
}
