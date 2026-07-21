export const LOCALE_COOKIE = "betclear_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Public URL segments */
export const locales = ["en", "br"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const localeConfig = {
  en: {
    language: "en",
    htmlLang: "en",
    country: null as string | null,
    market: "general" as const,
    label: "English",
    currency: "USD",
    intlLocale: "en-US",
  },
  br: {
    language: "pt-BR",
    htmlLang: "pt-BR",
    country: "BR",
    market: "BR" as const,
    label: "Português (Brasil)",
    currency: "BRL",
    intlLocale: "pt-BR",
  },
} as const;

export type LocaleMarket = (typeof localeConfig)[AppLocale]["market"];

export function isAppLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

/** Map cookie / language code to URL locale (`en` | `pt-BR` | `br`) */
export function languageToLocale(language: string): AppLocale | null {
  const normalized = language.trim().toLowerCase().replace(/_/g, "-");
  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }
  if (
    normalized === "pt-br" ||
    normalized === "br" ||
    normalized === "pt"
  ) {
    return "br";
  }
  if (isAppLocale(normalized)) {
    return normalized;
  }
  return null;
}

export function localeToLanguage(locale: AppLocale): "en" | "pt-BR" {
  return localeConfig[locale].language;
}

/** Cookie value preferred by product: `en` or `pt-BR` */
export function localeToCookieValue(locale: AppLocale): "en" | "pt-BR" {
  return localeToLanguage(locale);
}
