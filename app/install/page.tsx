import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { InstallActions } from "@/components/install/InstallActions";
import { InstallDownloadButton } from "@/components/install/InstallDownloadButton";
import { InstallPageTracker } from "@/components/onboarding/InstallPageTracker";
import { getAuthUser } from "@/lib/auth/user";
import { hasPaywallAccess, profileDownloadPath } from "@/lib/stripe/access";
import { isStripeConfigured } from "@/lib/stripe/client";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Install Protection",
  description:
    "Download and install the BetClear iPhone configuration profile for encrypted DNS protection.",
  alternates: { canonical: "/install" },
};

type PageProps = {
  searchParams: Promise<{ access?: string }>;
};

export default async function InstallPage({ searchParams }: PageProps) {
  const { access } = await searchParams;
  const paywallEnabled = isStripeConfigured();
  const authUser = await getAuthUser();
  const hasAccess = paywallEnabled ? await hasPaywallAccess(access) : true;
  const profileUrl = profileDownloadPath(access);

  return (
    <>
      <Header />
      <InstallPageTracker />
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
            iPhone setup
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
            Install BetClear Protection
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            This downloads an Apple configuration profile that points your
            iPhone at encrypted DNS on dns.betclear.app. Open this page in
            Safari on your iPhone, then tap the button below.
          </p>

          {hasAccess ? (
            <>
              <InstallDownloadButton profileUrl={profileUrl} />

              {paywallEnabled ? <InstallActions /> : null}
            </>
          ) : (
            <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                An active subscription is required before you can download the
                protection profile.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {isSupabaseAuthConfigured() ? (
                  <>
                    Sign in with the email you used at checkout. On iPhone, open
                    the sign-in link in Safari so your subscription and profile
                    download use the same browser.
                  </>
                ) : (
                  <>
                    If you just subscribed in Chrome or another browser, open
                    your payment confirmation link in Safari on this iPhone. iOS
                    does not share subscription access between browsers.
                  </>
                )}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {isSupabaseAuthConfigured() ? (
                  <Button href="/login?next=/install" size="lg">
                    Sign in
                  </Button>
                ) : null}
                <Button href="/onboarding/pricing" size="lg" variant="secondary">
                  Choose a plan
                </Button>
                <Button href="/pricing" variant="ghost" size="lg">
                  View pricing
                </Button>
              </div>
              {authUser?.email ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Signed in as {authUser.email}, but no active subscription was
                  found for this account.
                </p>
              ) : null}
            </div>
          )}

          <ol className="mt-12 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Subscribe</span>
              {" — "}
              Complete onboarding and start your 7-day free trial.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Download</span>
              {" — "}
              Tap Download Profile in Safari. Allow the configuration profile
              download when prompted.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Open Settings</span>
              {" — "}
              iOS shows Profile Downloaded. Open Settings, or go to Settings →
              General → VPN & Device Management.
            </li>
            <li>
              <span className="font-medium text-foreground">4. Install</span>
              {" — "}
              Tap BetClear Protection, then Install. Enter your passcode if
              asked.
            </li>
            <li>
              <span className="font-medium text-foreground">5. Confirm</span>
              {" — "}
              The profile configures DNS-over-HTTPS to
              https://dns.betclear.app/dns-query. Try a known gambling website
              to verify that protection is active.
            </li>
          </ol>

          <div className="mt-10 rounded-[1.5rem] bg-card p-5 ring-1 ring-border">
            <p className="text-sm leading-relaxed text-muted-foreground">
              BetClear does not gain access to your photos, messages, passwords,
              or personal files. You can remove the profile anytime from iPhone
              Settings.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
