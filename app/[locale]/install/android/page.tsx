import { notFound } from "next/navigation";
import { Link, redirect } from "@/lib/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { AndroidPrivateDnsGuide } from "@/components/install/AndroidPrivateDnsGuide";
import { InstallPageTracker } from "@/components/onboarding/InstallPageTracker";
import { hasPaywallAccess } from "@/lib/stripe/access";
import { DNS_HOSTNAME } from "@/lib/dns/config";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ access?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  return buildPageMetadata(locale, {
    path: "/install/android",
    title: dict.meta.installAndroidTitle,
    description: dict.meta.installAndroidDescription,
  });
}

export default async function InstallAndroidPage({
  params,
  searchParams,
}: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  const { access } = await searchParams;
  const hasAccess = await hasPaywallAccess(access);

  if (!hasAccess) {
    redirect({ href: "/pricing", locale });
  }

  return (
    <>
      <Header />
      <InstallPageTracker />
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <AndroidPrivateDnsGuide hostname={DNS_HOSTNAME} />

          <p className="mt-10 text-center text-sm text-muted-foreground">
            <Link
              href="/install"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {dict.installAndroid.usingIphone}
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
