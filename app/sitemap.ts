import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { allPostSlugs } from "@/lib/content/blog";
import { guideSlugs } from "@/lib/content/guides";
import { locales } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";

const INDEXABLE_PATHS = [
  "/",
  "/guides",
  "/install",
  "/pricing",
  "/privacy",
  "/terms",
  "/support",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of INDEXABLE_PATHS) {
      entries.push({
        url: `${SITE.url}${localizePath(locale, path)}`,
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path === "/guides" ? 0.7 : 0.6,
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
  }

  // The blog is a single top-level English section (not locale-prefixed).
  entries.push({
    url: `${SITE.url}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  });
  for (const slug of allPostSlugs()) {
    entries.push({
      url: `${SITE.url}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Root URL is a locale redirect — do not list it as a content page.
  return entries;
}
