import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { AccountActions } from "@/components/auth/AccountActions";
import { PricingCards } from "@/components/pricing/PricingCards";
import { requireAuthUser } from "@/lib/auth/user";
import { BILLING_PLANS } from "@/lib/stripe/config";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose monthly or annual BetClear protection for your iPhone.",
};

export default async function PricingPage() {
  const user = isSupabaseAuthConfigured()
    ? await requireAuthUser("/pricing")
    : null;

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

          {user?.email ? <AccountActions email={user.email} /> : null}

          <div className="mx-auto mt-12 max-w-4xl">
            <PricingCards plans={BILLING_PLANS} />
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            Already subscribed? Open the install page in Safari and sign in with
            the same email, or use Manage billing there to update payment
            details.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
