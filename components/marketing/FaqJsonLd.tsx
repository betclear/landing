import { SITE } from "@/lib/constants";
import type { AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPlanDisplay } from "@/lib/stripe/prices";

type FaqJsonLdProps = {
  locale: AppLocale;
};

export function FaqJsonLd({ locale }: FaqJsonLdProps) {
  const dictionary = getDictionary(locale);
  const annual = getPlanDisplay(locale, "annual");
  const monthly = getPlanDisplay(locale, "monthly");

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dictionary.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const product = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "iOS",
    description: dictionary.meta.homeDescription,
    offers: {
      "@type": "Offer",
      price: String(annual.amount),
      priceCurrency: annual.currency,
      description: `Annual plan with 7-day free trial; monthly plan available at ${monthly.formattedAmount}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
      />
    </>
  );
}
