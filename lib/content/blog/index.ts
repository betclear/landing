import type { AppLocale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { blogEn } from "./en";
import { blogPtBr } from "./pt-BR";
import {
  blogPostIds,
  type BlogBlock,
  type BlogModule,
  type BlogPathByLocale,
  type BlogPost,
  type BlogPostId,
  type BlogSummary,
} from "./types";

export { blogPostIds } from "./types";
export type {
  BlogBlock,
  BlogPost,
  BlogPostId,
  BlogSummary,
  BlogUi,
  BlogPathByLocale,
} from "./types";

const modules: Record<AppLocale, BlogModule> = {
  en: blogEn,
  br: blogPtBr,
};

export function getBlogUi(locale: AppLocale) {
  return modules[locale].ui;
}

export function getPost(locale: AppLocale, id: BlogPostId): BlogPost {
  return modules[locale].posts[id];
}

/** Summaries newest-first for the hub index. */
export function listPosts(locale: AppLocale): BlogSummary[] {
  return blogPostIds
    .map((id) => {
      const post = modules[locale].posts[id];
      return {
        id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        datePublished: post.datePublished,
        heroImage: post.heroImage,
        heroAlt: post.heroAlt,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.datePublished).getTime() -
        new Date(a.datePublished).getTime(),
    );
}

/** All slugs for one locale — used by generateStaticParams. */
export function postSlugs(locale: AppLocale): string[] {
  return blogPostIds.map((id) => modules[locale].posts[id].slug);
}

export function getPostBySlug(
  locale: AppLocale,
  slug: string,
): { id: BlogPostId; post: BlogPost } | null {
  for (const id of blogPostIds) {
    const post = modules[locale].posts[id];
    if (post.slug === slug) return { id, post };
  }
  return null;
}

export function getRelatedPosts(
  locale: AppLocale,
  post: BlogPost,
  currentId: BlogPostId,
): { id: BlogPostId; post: BlogPost }[] {
  return post.related
    .filter((id) => id !== currentId)
    .map((id) => ({ id, post: modules[locale].posts[id] }));
}

/**
 * Bare (locale-agnostic) path per locale for a post id, for canonical +
 * hreflang across localized slugs.
 */
export function blogPathByLocale(id: BlogPostId): BlogPathByLocale {
  const paths: BlogPathByLocale = {};
  for (const locale of locales) {
    paths[locale] = `/blog/${modules[locale].posts[id].slug}`;
  }
  return paths;
}

/** Rough reading time in minutes from the post body. */
export function readingMinutes(post: BlogPost): number {
  const text = post.body
    .map((block: BlogBlock) =>
      block.type === "list" ? block.items.join(" ") : block.text,
    )
    .join(" ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}
