import type { AppLocale } from "@/lib/i18n/config";

/** Stable, locale-independent identifiers for each guide. */
export const guideIds = [
  "stop-gambling",
  "block-iphone",
  "betting-games",
  "addiction-signs",
  "self-exclusion",
  "get-help",
] as const;

export type GuideId = (typeof guideIds)[number];

export type GuideSection = {
  heading: string;
  body?: string[];
  bullets?: string[];
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type GuideContent = {
  /** Locale-specific URL slug, e.g. "how-to-stop-gambling". */
  slug: string;
  /** Short hub card label. */
  cardTitle: string;
  /** Question-style H1 / meta title. */
  title: string;
  /** Meta description + hub card summary. */
  description: string;
  keywords: string[];
  datePublished: string;
  dateModified: string;
  /** One-line intro under the H1. */
  hero: string;
  /** Answer-first bullets that answer engines can quote directly. */
  tldr: string[];
  sections: GuideSection[];
  faq: GuideFaq[];
  cta: {
    title: string;
    body: string;
    button: string;
  };
  related: GuideId[];
};

/** Shared per-locale UI strings for the guides section. */
export type GuidesUi = {
  eyebrow: string;
  hubTitle: string;
  hubDescription: string;
  breadcrumbHome: string;
  breadcrumbGuides: string;
  tldrHeading: string;
  faqHeading: string;
  relatedHeading: string;
  backToGuides: string;
  updatedLabel: string;
  minRead: string;
  disclaimer: string;
  readMore: string;
};

export type GuidesModule = {
  ui: GuidesUi;
  guides: Record<GuideId, GuideContent>;
};

export type GuideSummary = {
  id: GuideId;
  slug: string;
  cardTitle: string;
  description: string;
};

/** Bare (locale-agnostic) path for a guide id, per locale, for hreflang. */
export type GuidePathByLocale = Partial<Record<AppLocale, string>>;
