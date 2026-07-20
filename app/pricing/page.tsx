import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { PricingCards } from "@/components/pricing/PricingCards";
import { BILLING_PLANS } from "@/lib/stripe/config";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose monthly or annual BetClear protection for your iPhone.",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium tracking-[-0.01em] text-primary">
              Pricing
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              Protection that stays on
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Subscribe once, download your iPhone profile, and keep gambling
              sites blocked system-wide. Cancel anytime from your billing portal.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <PricingCards plans={BILLING_PLANS} />
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            Already subscribed? Install your profile from the install page after
            checkout, or use Manage billing on that page to update payment
            details.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
