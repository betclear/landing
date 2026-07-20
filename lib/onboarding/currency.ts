export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "BRL",
  "NZD",
  "JPY",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_OPTIONS: {
  code: SupportedCurrency;
  label: string;
  symbol: string;
}[] = [
  { code: "USD", label: "USD — US Dollar", symbol: "$" },
  { code: "EUR", label: "EUR — Euro", symbol: "€" },
  { code: "GBP", label: "GBP — British Pound", symbol: "£" },
  { code: "AUD", label: "AUD — Australian Dollar", symbol: "A$" },
  { code: "CAD", label: "CAD — Canadian Dollar", symbol: "C$" },
  { code: "BRL", label: "BRL — Brazilian Real", symbol: "R$" },
  { code: "NZD", label: "NZD — New Zealand Dollar", symbol: "NZ$" },
  { code: "JPY", label: "JPY — Japanese Yen", symbol: "¥" },
];

const LOCALE_CURRENCY: Record<string, SupportedCurrency> = {
  US: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  NZ: "NZD",
  BR: "BRL",
  JP: "JPY",
  AT: "EUR",
  BE: "EUR",
  CY: "EUR",
  DE: "EUR",
  EE: "EUR",
  ES: "EUR",
  FI: "EUR",
  FR: "EUR",
  GR: "EUR",
  IE: "EUR",
  IT: "EUR",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  MT: "EUR",
  NL: "EUR",
  PT: "EUR",
  SI: "EUR",
  SK: "EUR",
};

export const QUICK_AMOUNTS = [100, 250, 500, 1000] as const;

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export function inferCurrencyFromLocale(
  locale = typeof navigator !== "undefined" ? navigator.language : "en-US",
): SupportedCurrency {
  try {
    const region =
      locale.includes("-") || locale.includes("_")
        ? locale.split(/[-_]/)[1]?.toUpperCase()
        : undefined;

    if (region && region in LOCALE_CURRENCY) {
      return LOCALE_CURRENCY[region];
    }

    const fromIntl = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
    }).resolvedOptions().currency;

    if (fromIntl && isSupportedCurrency(fromIntl)) {
      return fromIntl;
    }
  } catch {
    // Fall through to USD.
  }

  return "USD";
}

export function formatCurrencyAmount(
  amount: number,
  currency: string,
  locale?: string,
): string {
  const resolvedLocale =
    locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-US");

  try {
    return new Intl.NumberFormat(resolvedLocale, {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(Number.isInteger(amount) ? 0 : 2)}`;
  }
}

export function currencySymbol(currency: string): string {
  const match = CURRENCY_OPTIONS.find((option) => option.code === currency);
  return match?.symbol ?? currency;
}
