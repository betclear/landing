import { SITE } from "@/lib/constants";
import type { BlogPost, BlogUi } from "@/lib/content/blog";
import type { AppLocale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";

type BlogJsonLdProps = {
  locale: AppLocale;
  post: BlogPost;
  ui: BlogUi;
};

/** Article + BreadcrumbList structured data for a single blog post. */
export function BlogJsonLd({ locale, post, ui }: BlogJsonLdProps) {
  const inLanguage = locale === "br" ? "pt-BR" : "en";
  const url = `${SITE.url}${localizePath(locale, `/blog/${post.slug}`)}`;
  const blogUrl = `${SITE.url}${localizePath(locale, "/blog")}`;
  const image = `${SITE.url}${post.heroImage}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    inLanguage,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/icon` },
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ui.breadcrumbBlog, item: blogUrl },
      { "@type": "ListItem", position: 2, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
