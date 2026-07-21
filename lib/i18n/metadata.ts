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

export function buildPageMetadata(
  locale: AppLocale,
  options: {
    path?: string;
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImageAlt?: string;
    keywords?: string[];
  },
): Metadata {
  const path = options.path ?? "/";
  const ogTitle = options.ogTitle ?? options.title;
  const ogDescription = options.ogDescription ?? options.description;
  const dict = getDictionary(locale);
  const imageAlt = options.ogImageAlt ?? dict.meta.homeOgImageAlt;

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords ?? dict.meta.keywords,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: SITE.name,
      type: "website",
      url: `${SITE.url}${localizePath(locale, path)}`,
      locale: localeConfig[locale].htmlLang.replace("-", "_"),
      images: [
        {
          url: "/images/hero-iphone.png",
          width: 900,
          height: 1200,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ["/images/hero-iphone.png"],
    },
  };
}
