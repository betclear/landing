import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { postSlugs } from "@/lib/content/blog";
import { guideSlugs } from "@/lib/content/guides";
import { locales } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";

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
        url: `${SITE.url}${localizePath(locale, path)}`,
        lastModified: new Date(),
        changeFrequency: path === "/" || path === "/blog" ? "weekly" : "monthly",
        priority:
          path === "/" ? 1 : path === "/guides" || path === "/blog" ? 0.7 : 0.6,
      });
    }

    for (const slug of guideSlugs(locale)) {
      entries.push({
        url: `${SITE.url}${localizePath(locale, `/guides/${slug}`)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    for (const slug of postSlugs(locale)) {
      entries.push({
        url: `${SITE.url}${localizePath(locale, `/blog/${slug}`)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Root URL is a locale redirect — do not list it as a content page.
  return entries;
}
