import { blogPosts } from "./posts";
import type { BlogBlock, BlogPost } from "./types";

export type { BlogPost, BlogBlock } from "./types";

/** Posts ordered newest-first for the index. */
export function listPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
  );
}

export function allPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getPost(slug: string): BlogPost | null {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.related
    .map((slug) => getPost(slug))
    .filter((related): related is BlogPost => related !== null);
}

/** Rough reading time in minutes from the post body. */
export function readingMinutes(post: BlogPost): number {
  const text = post.body
    .map((block: BlogBlock) => {
      switch (block.type) {
        case "list":
          return block.items.join(" ");
        default:
          return block.text;
      }
    })
    .join(" ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}
