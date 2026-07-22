import { SITE } from "@/lib/constants";
import type { GuideContent } from "@/lib/content/guides";
import type { GuidesUi } from "@/lib/content/guides/types";
import type { AppLocale } from "@/lib/i18n/config";
import { getPathname } from "@/lib/i18n/navigation";

type GuideJsonLdProps = {
  locale: AppLocale;
  guide: GuideContent;
  ui: GuidesUi;
};

/** Article + FAQPage + BreadcrumbList structured data for a single guide. */
export function GuideJsonLd({ locale, guide, ui }: GuideJsonLdProps) {
  const inLanguage = locale === "br" ? "pt-BR" : "en";
  const url = `${SITE.url}${getPathname({ locale: locale, href: `/guides/${guide.slug}` })}`;
  const guidesUrl = `${SITE.url}${getPathname({ locale: locale, href: "/guides" })}`;
  const homeUrl = `${SITE.url}${getPathname({ locale: locale, href: "/" })}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    inLanguage,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${SITE.url}/opengraph-image`,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/icon.png` },
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: ui.breadcrumbHome,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: ui.breadcrumbGuides,
        item: guidesUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.cardTitle,
        item: url,
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
