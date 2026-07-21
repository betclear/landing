import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import type { AppLocale } from "@/lib/i18n/config";
import { localeConfig, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizePath } from "@/lib/i18n/routing";

export function buildAlternates(locale: AppLocale, path = "/") {
  const languages: Record<string, string> = {
    "x-default": localizePath("en", path),
  };

  for (const code of locales) {
    const hrefLang = localeConfig[code].language;
    languages[hrefLang] = localizePath(code, path);
  }

  return {
    canonical: localizePath(locale, path),
    languages,
  };
}

/**
 * Build canonical + hreflang from per-locale bare paths, for pages whose slug
 * differs between locales (e.g. localized guide slugs).
 */
export function buildAlternatesFromPaths(
  locale: AppLocale,
  pathByLocale: Partial<Record<AppLocale, string>>,
) {
  const enPath = pathByLocale.en ?? "/";
  const languages: Record<string, string> = {
    "x-default": localizePath("en", enPath),
  };

  for (const code of locales) {
    const hrefLang = localeConfig[code].language;
    languages[hrefLang] = localizePath(code, pathByLocale[code] ?? "/");
  }

  return {
    canonical: localizePath(locale, pathByLocale[locale] ?? "/"),
    languages,
  };
}

export function buildPageMetadata(
  locale: AppLocale,
  options: {
    path?: string;
    /** Per-locale bare paths for pages with localized slugs (overrides `path`). */
    pathByLocale?: Partial<Record<AppLocale, string>>;
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageAlt?: string;
    ogType?: "website" | "article";
    keywords?: string[];
    robotsIndex?: boolean;
  },
): Metadata {
  const path = options.path ?? "/";
  const ogTitle = options.ogTitle ?? options.title;
  const ogDescription = options.ogDescription ?? options.description;
  const dict = getDictionary(locale);
  const imageAlt = options.ogImageAlt ?? dict.meta.homeOgImageAlt;
  const alternates = options.pathByLocale
    ? buildAlternatesFromPaths(locale, options.pathByLocale)
    : buildAlternates(locale, path);
  const ogPath = options.pathByLocale?.[locale] ?? path;

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords ?? dict.meta.keywords,
    alternates,
    ...(options.robotsIndex === false
      ? { robots: { index: false, follow: true } }
      : {}),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: SITE.name,
      type: options.ogType ?? "website",
      url: `${SITE.url}${localizePath(locale, ogPath)}`,
      locale: localeConfig[locale].htmlLang.replace("-", "_"),
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ["/opengraph-image"],
    },
  };
}
