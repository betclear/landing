import { notFound } from "next/navigation";
import { AnalyticsLocaleSync } from "@/components/i18n/AnalyticsLocaleSync";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { SiteJsonLd } from "@/components/marketing/SiteJsonLd";
import {
  isAppLocale,
  locales,
  type AppLocale,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dictionary = getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <SiteJsonLd locale={locale} />
      <AnalyticsLocaleSync />
      {children}
    </LocaleProvider>
  );
}
