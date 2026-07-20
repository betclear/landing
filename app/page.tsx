import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyBetClear } from "@/components/landing/WhyBetClear";
import { InstallationPreview } from "@/components/landing/InstallationPreview";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <WhyBetClear />
        <InstallationPreview />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
