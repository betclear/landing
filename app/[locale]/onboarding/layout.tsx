import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { defaultCurrencyForLocale } from "@/lib/i18n/pricing";

// Onboarding is a private funnel — keep it out of search indexes.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

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
