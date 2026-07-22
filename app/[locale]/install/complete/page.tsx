import { notFound, redirect as nextRedirect } from "next/navigation";
import { redirect } from "@/lib/i18n/navigation";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CheckoutCompleteActions } from "@/components/install/CheckoutCompleteActions";
import { grantAccessFromCheckoutSession } from "@/lib/stripe/access";
import {
  isSafariUserAgent,
  isIosUserAgent,
  isAndroidUserAgent,
} from "@/lib/stripe/browser";
import { checkoutSuccessUrl } from "@/lib/stripe/config";
import { isStripeConfigured } from "@/lib/stripe/client";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return buildPageMetadata(locale, {
    path: "/install/complete",
    title: dict.meta.installCompleteTitle,
    description: dict.meta.installCompleteDescription,
    robotsIndex: false,
  });
}

function safariHandoffUrl(sessionId: string): string {
  return checkoutSuccessUrl(sessionId);
}

export default async function InstallCompletePage({
  params,
  searchParams,
}: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  if (!isStripeConfigured()) {
    redirect({ href: "/pricing", locale });
  }

  const { session_id: sessionIdRaw } = await searchParams;
  if (!sessionIdRaw) {
    redirect({ href: "/pricing", locale });
  }
  const sessionId = sessionIdRaw as string;

  const token = await grantAccessFromCheckoutSession(sessionId);
  if (!token) {
    redirect({ href: "/pricing?error=checkout", locale });
  }
  const accessToken = token as string;

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "";

  if (isAndroidUserAgent(userAgent)) {
    redirect({ href: `/install/android?access=${encodeURIComponent(accessToken)}`, locale });
  }

  if (isSafariUserAgent(userAgent)) {
    nextRedirect(checkoutSuccessUrl(sessionId));
  }

  const handoffUrl = safariHandoffUrl(sessionId);

  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <p className="text-sm font-medium text-primary">
            {dict.installComplete.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-foreground">
            {dict.installComplete.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {dict.installComplete.description}
          </p>

          <CheckoutCompleteActions
            safariHandoffUrl={handoffUrl}
            requireCopyHandoff={
              isIosUserAgent(userAgent) && !isSafariUserAgent(userAgent)
            }
          />

          <ol className="mt-12 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            {dict.installComplete.steps.map((step, index) => (
              <li key={step.title}>
                <span className="font-medium text-foreground">
                  {index + 1}. {step.title}
                </span>
                {" - "}
                {step.detail}
              </li>
            ))}
          </ol>
        </Container>
      </main>
      <Footer />
    </>
  );
}
