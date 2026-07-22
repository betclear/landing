import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { postSlugs } from "@/lib/content/blog";
import { guideSlugs } from "@/lib/content/guides";
import { locales } from "@/lib/i18n/config";
import { getPathname } from "@/lib/i18n/navigation";

const INDEXABLE_PATHS = [
  "/",
  "/guides",
  "/blog",
  "/install",
  "/pricing",
  "/privacy",
  "/terms",
  "/support",
  "/report-site",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of INDEXABLE_PATHS) {
      entries.push({
        url: `${SITE.url}${getPathname({ locale: locale, href: path })}`,
        lastModified: new Date(),
        changeFrequency: path === "/" || path === "/blog" ? "weekly" : "monthly",
        priority:
          path === "/" ? 1 : path === "/guides" || path === "/blog" ? 0.7 : 0.6,
      });
    }

    for (const slug of guideSlugs(locale)) {
      entries.push({
        url: `${SITE.url}${getPathname({ locale: locale, href: `/guides/${slug}` })}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const slug of postSlugs(locale)) {
      entries.push({
        url: `${SITE.url}${getPathname({ locale: locale, href: `/blog/${slug}` })}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Root URL is a locale redirect — do not list it as a content page.
  return entries;
}
