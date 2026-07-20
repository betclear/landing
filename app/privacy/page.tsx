import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy",
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
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            BetClear does not collect browsing history. Blocking is handled
            on-device through Apple configuration profiles. A full privacy policy
            will be published before checkout launches.
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
