import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms",
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
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Full terms of service will be published before purchase is enabled.
            BetClear is designed to help you block gambling websites on iPhone
            using Apple configuration profiles.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Questions:{" "}
            <a
              href="mailto:hello@betclear.app"
              className="text-foreground underline-offset-4 hover:underline"
            >
              hello@betclear.app
            </a>
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
