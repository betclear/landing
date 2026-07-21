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
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { StickyMobileCTA } from "@/components/marketing/StickyMobileCTA";
import { FaqJsonLd } from "@/components/marketing/FaqJsonLd";
import { getProductStats } from "@/lib/product-stats";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return buildPageMetadata(locale, {
    path: "/",
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    ogTitle: dict.meta.homeOgTitle,
    ogDescription: dict.meta.homeOgDescription,
    ogImageAlt: dict.meta.homeOgImageAlt,
    keywords: dict.meta.keywords,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const stats = await getProductStats();

  return (
    <>
      <FaqJsonLd locale={locale} />
      <Header />
      <main>
        <Hero domainCountLabel={stats.domainCountLabel} />
        <TrustStrip domainCountLabel={stats.domainCountLabel} />
        <BlockingDemo />
        <FeatureStories />
        <CostComparison />
        <InstallationSteps />
        <PricingSection />
        <FAQ />
        <FinalCTA domainCountLabel={stats.domainCountLabel} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
