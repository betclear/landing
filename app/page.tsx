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

export default async function HomePage() {
  const stats = await getProductStats();

  return (
    <>
      <FaqJsonLd />
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
