import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Pricing",
  description: "BetClear pricing will be available soon.",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center py-20">
        <Container className="text-center">
          <p className="text-sm font-medium tracking-[-0.01em] text-primary">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            Pricing Coming Soon
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Checkout and profile download are next. For now, explore how
            BetClear works on the landing page.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/" variant="secondary">
              Back to home
            </Button>
            <Button href="mailto:hello@betclear.app">Contact us</Button>
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            Or email{" "}
            <Link
              href="mailto:hello@betclear.app"
              className="text-foreground underline-offset-4 hover:underline"
            >
              hello@betclear.app
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
