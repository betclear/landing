import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PaymentSuccess } from "@/components/onboarding/PaymentSuccess";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
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
    path: "/payment/success",
    title: dict.meta.paymentSuccessTitle,
    description: dict.paymentSuccess.loadingDescription,
  });
}

export default async function PaymentSuccessPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-primary"
            aria-hidden="true"
          />
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}
