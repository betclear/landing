import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { AccountActions } from "@/components/auth/AccountActions";
import { PricingCards } from "@/components/pricing/PricingCards";
import { requireAuthUser } from "@/lib/auth/user";
import { BILLING_PLANS } from "@/lib/stripe/config";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { localizePath } from "@/lib/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return buildPageMetadata(locale, {
    path: "/pricing",
    title: dict.meta.pricingTitle,
    description: dict.meta.pricingDescription,
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);
  const pricingPath = localizePath(locale, "/pricing");

  const user = isSupabaseAuthConfigured()
    ? await requireAuthUser(pricingPath, locale)
    : null;

  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium tracking-[-0.01em] text-primary">
              {dict.pricing.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              {dict.pricing.pageTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {dict.pricing.pageDescription}
            </p>
          </div>

          {user?.email ? <AccountActions email={user.email} /> : null}

          <div className="mx-auto mt-12 max-w-4xl">
            <PricingCards plans={BILLING_PLANS} />
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            {dict.pricing.preferGuided}{" "}
            <a
              href={localizePath(locale, "/onboarding/spend")}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {dict.pricing.beginOnboarding}
            </a>
            . {dict.pricing.alreadySubscribed}
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
