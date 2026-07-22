import type { DevicePlatform } from "@/lib/device/platform";
import { SITE } from "@/lib/constants";
import type { AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pickPlatformContent } from "@/lib/i18n/platform-content";
import { translate } from "@/lib/i18n/translate";
import { getPlanDisplay } from "@/lib/stripe/prices";

type FaqJsonLdProps = {
  locale: AppLocale;
  platform?: DevicePlatform;
};

export function FaqJsonLd({ locale, platform = "unknown" }: FaqJsonLdProps) {
  const dictionary = getDictionary(locale);
  const faqItems = pickPlatformContent(
    platform,
    dictionary.faq.items,
    dictionary.faq.items_ios,
    dictionary.faq.items_android,
  );
  const annual = getPlanDisplay(locale, "annual");
  const monthly = getPlanDisplay(locale, "monthly");

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
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
    operatingSystem:
      platform === "android"
        ? "Android"
        : platform === "ios"
          ? "iOS"
          : "iOS, Android",
    description: translate(dictionary, "meta.homeDescription", undefined, platform),
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
