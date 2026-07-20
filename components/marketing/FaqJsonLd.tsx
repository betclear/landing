import { FAQ_ITEMS, SITE } from "@/lib/constants";

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
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
    description: SITE.longDescription,
    offers: {
      "@type": "Offer",
      price: "29.99",
      priceCurrency: "USD",
      description: "Annual plan with 7-day free trial; monthly plan available at $3.99",
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
