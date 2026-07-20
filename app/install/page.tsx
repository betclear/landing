import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Install Protection",
  description:
    "Download and install the BetClear iPhone configuration profile for encrypted DNS protection.",
};

export default function InstallPage() {
  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <p className="text-sm font-medium text-primary">iPhone</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-foreground">
            Install BetClear Protection
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            This downloads an Apple configuration profile that points your iPhone
            at encrypted DNS on dns.betclear.app. Open this page in Safari on
            your iPhone, then tap the button below.
          </p>

          <div className="mt-8">
            <Button href="/api/profile" size="lg">
              Download Profile
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Or open directly:{" "}
            <a
              href="/api/profile"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              /api/profile
            </a>
          </p>

          <ol className="mt-12 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Download</span>
              {" - "}
              Tap Download Profile in Safari. Allow the configuration profile
              download when prompted.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Open Settings</span>
              {" - "}
              iOS shows Profile Downloaded. Open Settings, or go to Settings →
              General → VPN & Device Management.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Install</span>
              {" - "}
              Tap BetClear Protection, then Install. Enter your passcode if
              asked.
            </li>
            <li>
              <span className="font-medium text-foreground">4. Confirm DNS</span>
              {" - "}
              The profile configures DNS-over-HTTPS to
              https://dns.betclear.app/dns-query. Blocking works once that
              resolver is live.
            </li>
          </ol>
        </Container>
      </main>
      <Footer />
    </>
  );
}
