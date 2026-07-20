import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { InsightSection } from "@/components/marketing/InsightSection";
import { BlockingDemo } from "@/components/marketing/BlockingDemo";
import { FeatureStories } from "@/components/marketing/FeatureStories";
import { ProgressSection } from "@/components/marketing/ProgressSection";
import { InstallationSteps } from "@/components/marketing/InstallationSteps";
import { ComparisonSection } from "@/components/marketing/ComparisonSection";
import { ProtectionStack } from "@/components/marketing/ProtectionStack";
import { PrivacySection } from "@/components/marketing/PrivacySection";
import { ProductProof } from "@/components/marketing/ProductProof";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { FaqJsonLd } from "@/components/marketing/FaqJsonLd";
import { getProductStats } from "@/lib/product-stats";

export default async function HomePage() {
  const stats = await getProductStats();

  return (
    <>
      <FaqJsonLd />
      <Header />
      <main>
        <Hero />
        <TrustStrip domainCountLabel={stats.domainCountLabel} />
        <InsightSection />
        <BlockingDemo />
        <FeatureStories />
        <ProgressSection />
        <InstallationSteps />
        <ComparisonSection />
        <ProtectionStack />
        <PrivacySection />
        <ProductProof
          domainCountLabel={stats.domainCountLabel}
          sourcesSucceeded={stats.sourcesSucceeded}
        />
        <PricingSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
