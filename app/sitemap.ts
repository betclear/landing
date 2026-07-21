import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { locales } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";

const INDEXABLE_PATHS = [
  "/",
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
        priority: path === "/" ? 1 : 0.6,
      });
    }
  }

  // Root URL is a locale redirect — do not list it as a content page.
  return entries;
}
