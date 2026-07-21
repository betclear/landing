import { notFound } from "next/navigation";
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
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { localizePath } from "@/lib/i18n/routing";
import { interpolate } from "@/lib/i18n/translate";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ access?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return buildPageMetadata(locale, {
    path: "/install",
    title: dict.meta.installTitle,
    description: dict.meta.installDescription,
  });
}

export default async function InstallPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

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
            {dict.install.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
            {dict.install.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {dict.install.description}
          </p>

          {hasAccess ? (
            <>
              <InstallDownloadButton
                profileUrl={profileUrl}
                accessToken={access}
              />

              {paywallEnabled ? <InstallActions /> : null}
            </>
          ) : (
            <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {dict.install.subscribeRequired}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {isSupabaseAuthConfigured()
                  ? dict.install.signInSafariNote
                  : dict.install.otherBrowserNote}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {isSupabaseAuthConfigured() ? (
                  <Button
                    href={`${localizePath(locale, "/login")}?next=${encodeURIComponent(localizePath(locale, "/install"))}`}
                    size="lg"
                  >
                    {dict.install.signIn}
                  </Button>
                ) : null}
                <Button
                  href={localizePath(locale, "/onboarding/pricing")}
                  size="lg"
                  variant="secondary"
                >
                  {dict.install.choosePlan}
                </Button>
                <Button
                  href={localizePath(locale, "/pricing")}
                  variant="ghost"
                  size="lg"
                >
                  {dict.install.viewPricing}
                </Button>
              </div>
              {authUser?.email ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  {interpolate(dict.install.signedInNoSub, {
                    email: authUser.email,
                  })}
                </p>
              ) : null}
            </div>
          )}

          <ol className="mt-12 space-y-5 text-[15px] leading-relaxed text-muted-foreground">
            {dict.install.steps.map((step, index) => (
              <li key={step.title}>
                <span className="font-medium text-foreground">
                  {index + 1}. {step.title}
                </span>
                {" — "}
                {step.detail}
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-[1.5rem] bg-card p-5 ring-1 ring-border">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dict.install.privacyNote}
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
