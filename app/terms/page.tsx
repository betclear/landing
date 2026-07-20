import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for BetClear iPhone gambling website protection.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="py-20 sm:py-28">
        <Container className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground">
            Terms
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              BetClear provides tools to help block gambling websites on iPhone
              using Apple configuration profiles and protected DNS.
            </p>
            <p>
              BetClear is not a medical service and is not a replacement for
              professional help.
            </p>
            <section id="billing" className="scroll-mt-24 space-y-3">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                Billing terms
              </h2>
              <p>
                Paid plans begin with a 7-day free trial. After the trial, the
                Annual plan is billed at $29.99 per year and the Monthly plan is
                billed at $3.99 per month, unless otherwise stated at checkout.
              </p>
              <p>
                Cancel anytime before the trial ends to avoid being charged.
                After billing begins, you can cancel future renewals from your
                Stripe customer portal or by contacting support. Taxes may
                apply based on your location.
              </p>
              <p>
                Impact estimates shown during onboarding are informational only
                and are based on the information you provide. They are not a
                guarantee of savings or outcomes.
              </p>
            </section>
            <p>
              Questions:{" "}
              <a
                href="mailto:hello@betclear.app"
                className="text-foreground underline-offset-4 hover:underline"
              >
                hello@betclear.app
              </a>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
