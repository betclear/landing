import { defineRouting } from "next-intl/routing";
import {
  defaultLocale,
  isAppLocale,
  languageToLocale,
  locales,
  type AppLocale,
} from "@/lib/i18n/config";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});

/** Paths that should not receive a locale prefix */
export const LOCALE_EXCLUDED_PREFIXES = [
  "/api",
  "/admin",
  "/auth/callback",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/llms.txt",
  "/opengraph-image",
  "/apple-icon",
  "/icon",
  "/apple-icon.png",
  "/icon.png",
  "/gclid.js",
] as const;

export function hasLocalePrefix(pathname: string): boolean {
  const segment = pathname.split("/")[1];
  return Boolean(segment && isAppLocale(segment));
}

export function getLocaleFromPathname(pathname: string): AppLocale | null {
  const segment = pathname.split("/")[1];
  if (segment && isAppLocale(segment)) return segment;
  return null;
}

export function stripLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname || "/";
  const rest = pathname.slice(locale.length + 1) || "/";
  return rest.startsWith("/") ? rest : `/${rest}`;
}

export function isLocaleExcludedPath(pathname: string): boolean {
  return LOCALE_EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function resolvePreferredLocale(options: {
  cookieLocale?: string | null;
  country?: string | null;
}): AppLocale {
  if (options.cookieLocale) {
    const fromCookie = languageToLocale(options.cookieLocale);
    if (fromCookie) return fromCookie;
  }

  if (options.country?.toUpperCase() === "BR") {
    return "br";
  }

  return defaultLocale;
}
