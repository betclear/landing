import { notFound } from "next/navigation";
import { redirect } from "@/lib/i18n/navigation";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OnboardingIndexPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  redirect({ href: "/onboarding/spend", locale });
}
