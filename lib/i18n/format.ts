import {
  localeConfig,
  type AppLocale,
} from "@/lib/i18n/config";

export function getIntlLocale(locale: AppLocale): string {
  return localeConfig[locale].intlLocale;
}

export function formatCurrency(
  amount: number,
  locale: AppLocale,
  currency?: string,
): string {
  const resolvedCurrency = currency ?? localeConfig[locale].currency;
  try {
    return new Intl.NumberFormat(getIntlLocale(locale), {
      style: "currency",
      currency: resolvedCurrency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${resolvedCurrency} ${amount.toFixed(2)}`;
  }
}

export function formatNumber(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(getIntlLocale(locale)).format(value);
}

export function formatDate(
  date: Date | string,
  locale: AppLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const resolved =
    typeof date === "string"
      ? (() => {
          const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
          if (match) {
            return new Date(
              Number(match[1]),
              Number(match[2]) - 1,
              Number(match[3]),
            );
          }
          return new Date(date);
        })()
      : date;

  if (Number.isNaN(resolved.getTime())) {
    return String(date);
  }

  return new Intl.DateTimeFormat(
    getIntlLocale(locale),
    options ?? {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(resolved);
}

export function formatLongDate(
  date: Date | string,
  locale: AppLocale,
): string {
  return formatDate(date, locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDurationHours(
  hours: number,
  locale: AppLocale,
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    maximumFractionDigits: 1,
  }).format(hours);
}
