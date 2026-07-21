export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export type BlogPost = {
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
  /** Body content as ordered blocks. */
  body: BlogBlock[];
  /** Slugs of related posts. */
  related: string[];
};
