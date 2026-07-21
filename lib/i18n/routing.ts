import {
  defaultLocale,
  isAppLocale,
  languageToLocale,
  type AppLocale,
} from "@/lib/i18n/config";

/** Paths that should not receive a locale prefix */
export const LOCALE_EXCLUDED_PREFIXES = [
  "/api",
  "/admin",
  "/auth/callback",
  "/_next",
  "/favicon.ico",
] as const;

/** Legacy root paths that permanently redirect to /en/... */
export const LEGACY_REDIRECT_PATHS = [
  "/onboarding",
  "/install",
  "/install-test",
  "/privacy",
  "/terms",
  "/pricing",
  "/login",
  "/auth",
  "/payment",
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

/**
 * Build a localized path. Accepts absolute paths without locale prefix,
 * hash-only links, and mailto/external URLs (returned unchanged).
 */
export function localizePath(
  locale: AppLocale,
  href: string,
): string {
  if (
    !href ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//")
  ) {
    return href;
  }

  if (href.startsWith("#")) {
    return `/${locale}${href}`;
  }

  const [pathPart, hash] = href.split("#");
  const path = pathPart || "/";
  const hashSuffix = hash ? `#${hash}` : "";

  if (hasLocalePrefix(path)) {
    return `${path}${hashSuffix}`;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}${hashSuffix}`;
  }

  return `/${locale}${normalized}${hashSuffix}`;
}

/** Switch locale while preserving the current path (without locale prefix). */
export function switchLocalePath(
  currentPathname: string,
  targetLocale: AppLocale,
  hash?: string,
): string {
  const bare = stripLocalePrefix(currentPathname);
  const withHash = hash ? `${bare}${hash.startsWith("#") ? hash : `#${hash}`}` : bare;
  return localizePath(targetLocale, withHash);
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
