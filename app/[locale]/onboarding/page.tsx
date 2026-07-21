import { notFound, redirect } from "next/navigation";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OnboardingIndexPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  redirect(localizePath(locale, "/onboarding/spend"));
}
