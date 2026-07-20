import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Install Test Profile",
  description:
    "Download a BetClear test configuration profile for iPhone encrypted DNS.",
  robots: { index: false, follow: false },
};

export default function InstallTestPage() {
  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Prototype</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-foreground">
            Install test profile
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Download a BetClear iOS configuration profile that points your iPhone
            at encrypted DNS on dns.betclear.app. The DNS resolver itself is not
            live yet. This download only verifies profile generation and install
            flow.
          </p>

          <div className="mt-8">
            <Button href="/api/profile" size="lg">
              Download Test Profile
            </Button>
          </div>

          <ol className="mt-12 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Download</span>
              {" - "}
              Tap Download Test Profile on your iPhone (Safari recommended).
            </li>
            <li>
              <span className="font-medium text-foreground">2. Open Settings</span>
              {" - "}
              iOS shows a Profile Downloaded notice. Open it from Settings.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Install</span>
              {" - "}
              Confirm installation. You may need your device passcode.
            </li>
            <li>
              <span className="font-medium text-foreground">4. Review DNS</span>
              {" - "}
              Check Settings → General → VPN & Device Management for BetClear
              Protection. DNS filtering will work once the resolver is deployed.
            </li>
          </ol>
        </Container>
      </main>
      <Footer />
    </>
  );
}
