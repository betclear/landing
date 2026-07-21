import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { defaultCurrencyForLocale } from "@/lib/i18n/pricing";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function OnboardingLayout({
  children,
  params,
}: LayoutProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;

  return (
    <OnboardingProvider defaultCurrency={defaultCurrencyForLocale(locale)}>
      {children}
    </OnboardingProvider>
  );
}
