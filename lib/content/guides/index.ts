import type { AppLocale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { guidesEn } from "./en";
import { guidesPtBr } from "./pt-BR";
import {
  guideIds,
  type GuideContent,
  type GuideId,
  type GuidePathByLocale,
  type GuidesModule,
  type GuideSummary,
} from "./types";

export { guideIds } from "./types";
export type {
  GuideContent,
  GuideId,
  GuideSection,
  GuideFaq,
  GuideSummary,
  GuidePathByLocale,
} from "./types";

const modules: Record<AppLocale, GuidesModule> = {
  en: guidesEn,
  br: guidesPtBr,
};

export function getGuidesUi(locale: AppLocale) {
  return modules[locale].ui;
}

export function getGuide(locale: AppLocale, id: GuideId): GuideContent {
  return modules[locale].guides[id];
}

/** Ordered summaries for the hub index. */
export function listGuides(locale: AppLocale): GuideSummary[] {
  return guideIds.map((id) => {
    const guide = modules[locale].guides[id];
    return {
      id,
      slug: guide.slug,
      cardTitle: guide.cardTitle,
      description: guide.description,
    };
  });
}

/** All slugs for one locale — used by generateStaticParams. */
export function guideSlugs(locale: AppLocale): string[] {
  return guideIds.map((id) => modules[locale].guides[id].slug);
}

export function getGuideBySlug(
  locale: AppLocale,
  slug: string,
): { id: GuideId; guide: GuideContent } | null {
  for (const id of guideIds) {
    const guide = modules[locale].guides[id];
    if (guide.slug === slug) return { id, guide };
  }
  return null;
}

/**
 * Bare (locale-agnostic) path per locale for a guide id, e.g.
 * { en: "/guides/how-to-stop-gambling", br: "/guides/como-parar-de-apostar" }.
 * Used to build correct canonical + hreflang across localized slugs.
 */
export function guidePathByLocale(id: GuideId): GuidePathByLocale {
  const paths: GuidePathByLocale = {};
  for (const locale of locales) {
    paths[locale] = `/guides/${modules[locale].guides[id].slug}`;
  }
  return paths;
}

/** Rough reading time in minutes from the guide body. */
export function guideReadingMinutes(guide: GuideContent): number {
  const text = [
    guide.hero,
    ...guide.tldr,
    ...guide.sections.flatMap((section) => [
      section.heading,
      ...(section.body ?? []),
      ...(section.bullets ?? []),
    ]),
    ...guide.faq.flatMap((item) => [item.question, item.answer]),
  ].join(" ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}
