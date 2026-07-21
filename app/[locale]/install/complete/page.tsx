import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { CheckoutCompleteActions } from "@/components/install/CheckoutCompleteActions";
import { grantAccessFromCheckoutSession } from "@/lib/stripe/access";
import { isSafariUserAgent, isIosUserAgent } from "@/lib/stripe/browser";
import { checkoutSuccessUrl } from "@/lib/stripe/config";
import { isStripeConfigured } from "@/lib/stripe/client";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { localizePath } from "@/lib/i18n/routing";

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
    redirect(localizePath(locale, "/install"));
  }

  const { session_id: sessionId } = await searchParams;
  if (!sessionId) {
    redirect(localizePath(locale, "/pricing"));
  }

  const token = await grantAccessFromCheckoutSession(sessionId);
  if (!token) {
    redirect(`${localizePath(locale, "/pricing")}?error=checkout`);
  }

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "";

  if (isSafariUserAgent(userAgent)) {
    redirect(checkoutSuccessUrl(sessionId));
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
