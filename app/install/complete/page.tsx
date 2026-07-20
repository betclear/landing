import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CheckoutCompleteActions } from "@/components/install/CheckoutCompleteActions";
import {
  grantAccessFromCheckoutSession,
  setAccessCookie,
} from "@/lib/stripe/access";
import { isSafariUserAgent, isIosUserAgent } from "@/lib/stripe/browser";
import { getSiteUrl } from "@/lib/stripe/config";
import { isStripeConfigured } from "@/lib/stripe/client";

export const metadata: Metadata = {
  title: "Subscription Confirmed",
  description:
    "Your BetClear subscription is active. Continue in Safari to install protection on your iPhone.",
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

function safariHandoffUrl(sessionId: string): string {
  return `${getSiteUrl()}/install/complete?session_id=${encodeURIComponent(sessionId)}`;
}

export default async function InstallCompletePage({ searchParams }: PageProps) {
  if (!isStripeConfigured()) {
    redirect("/install");
  }

  const { session_id: sessionId } = await searchParams;
  if (!sessionId) {
    redirect("/pricing");
  }

  const token = await grantAccessFromCheckoutSession(sessionId);
  if (!token) {
    redirect("/pricing?error=checkout");
  }

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "";

  if (isSafariUserAgent(userAgent)) {
    await setAccessCookie(token);
    redirect("/install");
  }

  const handoffUrl = safariHandoffUrl(sessionId);

  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Payment confirmed</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-foreground">
            One more step in Safari
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Your subscription is active. Apple configuration profiles can only
            be installed from Safari, and iPhone browsers do not share sign-in
            cookies between Chrome and Safari.
          </p>

          <CheckoutCompleteActions
            safariHandoffUrl={handoffUrl}
            showIosHint={isIosUserAgent(userAgent)}
          />

          <ol className="mt-12 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Open Safari</span>
              {" - "}
              Tap Continue in Safari above, or paste the copied link into Safari
              on your iPhone.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Install</span>
              {" - "}
              You will land on the install page. Tap Download Profile and follow
              the iOS prompts.
            </li>
          </ol>
        </Container>
      </main>
      <Footer />
    </>
  );
}
