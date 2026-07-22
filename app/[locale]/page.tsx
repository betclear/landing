import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { BlockingDemo } from "@/components/marketing/BlockingDemo";
import { FeatureStories } from "@/components/marketing/FeatureStories";
import { CostComparison } from "@/components/marketing/CostComparison";
import { InstallationSteps } from "@/components/marketing/InstallationSteps";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FAQ } from "@/components/marketing/FAQ";
import { GuidesTeaser } from "@/components/marketing/GuidesTeaser";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { StickyMobileCTA } from "@/components/marketing/StickyMobileCTA";
import { FaqJsonLd } from "@/components/marketing/FaqJsonLd";
import { getProductStats } from "@/lib/product-stats";
import { detectDevicePlatform } from "@/lib/device/platform";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { translate } from "@/lib/i18n/translate";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);
  const userAgent = (await headers()).get("user-agent") ?? "";
  const platform = detectDevicePlatform(userAgent);

  return buildPageMetadata(locale, {
    path: "/",
    title: translate(dict, "meta.homeTitle", undefined, platform),
    description: translate(dict, "meta.homeDescription", undefined, platform),
    ogTitle: translate(dict, "meta.homeOgTitle", undefined, platform),
    ogDescription: translate(dict, "meta.homeOgDescription", undefined, platform),
    ogImageAlt: translate(dict, "meta.homeOgImageAlt", undefined, platform),
    keywords: dict.meta.keywords,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const stats = await getProductStats();
  const userAgent = (await headers()).get("user-agent") ?? "";
  const platform = detectDevicePlatform(userAgent);

  return (
    <>
      <FaqJsonLd locale={locale} platform={platform} />
      <Header />
      <main>
        <Hero domainCountLabel={stats.domainCountLabel} />
        <TrustStrip domainCountLabel={stats.domainCountLabel} />
        <BlockingDemo />
        <FeatureStories />
        <CostComparison />
        <InstallationSteps />
        <PricingSection />
        <GuidesTeaser locale={locale} />
        <FAQ />
        <FinalCTA domainCountLabel={stats.domainCountLabel} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
