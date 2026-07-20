import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How BetClear handles privacy for iPhone gambling website protection.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="py-20 sm:py-28">
        <Container className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground">
            Privacy
          </h1>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              BetClear is designed to block gambling websites through protected
              DNS — not to monitor your personal life.
            </p>
            <p>
              The iPhone configuration profile configures encrypted DNS
              (DNS-over-HTTPS). It does not grant BetClear access to your
              photos, messages, passwords, or personal files.
            </p>
            <p>
              BetClear does not need Safari browsing history to block gambling
              domains. Like any DNS-based service, the resolver receives
              domain-name lookups required to answer DNS queries — not the full
              contents of pages you visit.
            </p>
            <p>
              A fuller privacy policy will be published before paid checkout
              launches. Questions:{" "}
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
