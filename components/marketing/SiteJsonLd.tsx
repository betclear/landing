import { SITE } from "@/lib/constants";
import type { AppLocale } from "@/lib/i18n/config";
import { getPathname } from "@/lib/i18n/navigation";

type SiteJsonLdProps = {
  locale: AppLocale;
};

/** Sitewide Organization + WebSite structured data. */
export function SiteJsonLd({ locale }: SiteJsonLdProps) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.png`,
    email: SITE.email,
    description: SITE.longDescription,
    sameAs: [] as string[],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: `${SITE.url}${getPathname({ locale: locale, href: "/" })}`,
    inLanguage: locale === "br" ? "pt-BR" : "en",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
