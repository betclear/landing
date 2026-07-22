import type { AppLocale } from "@/lib/i18n/config";

/** Stable, locale-independent identifiers for each blog post. */
export const blogPostIds = [
  "online-betting",
  "how-to-stop",
  "my-life-changed",
  "self-help",
  "jamie-story",
] as const;

export type BlogPostId = (typeof blogPostIds)[number];

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export type BlogPost = {
  /** Locale-specific URL slug, e.g. "how-to-stop-gambling". */
  slug: string;
  title: string;
  /** Short card + hero subtitle. */
  excerpt: string;
  /** Meta description (<=160 chars ideal). */
  description: string;
  category: string;
  author: string;
  /** ISO date. */
  datePublished: string;
  dateModified: string;
  heroImage: string;
  heroAlt: string;
  keywords: string[];
  body: BlogBlock[];
  /** Stable ids of related posts. */
  related: BlogPostId[];
};

/** Shared per-locale UI strings for the blog section. */
export type BlogUi = {
  eyebrow: string;
  hubTitle: string;
  hubDescription: string;
  breadcrumbHome: string;
  breadcrumbBlog: string;
  readStory: string;
  keepReading: string;
  allArticles: string;
  minRead: string;
  disclaimer: string;
  /** In-article conversion CTA (after the intro). */
  cta: { title: string; body: string; button: string };
  /** Closing conversion CTA (end of article). */
  ctaClosing: { title: string; body: string };
};

export type BlogModule = {
  ui: BlogUi;
  posts: Record<BlogPostId, BlogPost>;
};

export type BlogSummary = {
  id: BlogPostId;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  datePublished: string;
  heroImage: string;
  heroAlt: string;
};

/** Bare (locale-agnostic) path for a post id, per locale, for hreflang. */
export type BlogPathByLocale = Partial<Record<AppLocale, string>>;
