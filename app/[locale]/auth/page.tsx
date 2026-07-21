import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { AuthStep } from "@/components/onboarding/AuthStep";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultCurrencyForLocale } from "@/lib/i18n/pricing";
import { buildPageMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return buildPageMetadata(locale, {
    path: "/auth",
    title: dict.meta.onboardingTitle,
    description: dict.meta.loginDescription,
  });
}

export default async function AuthPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return (
    <OnboardingProvider defaultCurrency={defaultCurrencyForLocale(locale)}>
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
            {dict.common.loading}
          </div>
        }
      >
        <AuthStep />
      </Suspense>
    </OnboardingProvider>
  );
}
