import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { InstallActions } from "@/components/install/InstallActions";
import { InstallDownloadButton } from "@/components/install/InstallDownloadButton";
import { InstallPageTracker } from "@/components/onboarding/InstallPageTracker";
import { hasPaywallAccess, profileDownloadPath } from "@/lib/stripe/access";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { localizePath } from "@/lib/i18n/routing";

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
    path: "/install",
    title: dict.meta.installTitle,
    description: dict.meta.installDescription,
  });
}

export default async function InstallPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const dict = getDictionary(locale);

  const { access } = await searchParams;
  const hasAccess = await hasPaywallAccess(access);

  if (!hasAccess) {
    redirect(localizePath(locale, "/pricing"));
  }

  const profileUrl = profileDownloadPath(access);

  return (
    <>
      <Header />
      <InstallPageTracker />
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
            {dict.install.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
            {dict.install.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {dict.install.description}
          </p>

          <InstallDownloadButton
            profileUrl={profileUrl}
            accessToken={access}
          />

          <InstallActions />

          <div className="mt-10 rounded-[1.5rem] bg-card p-5 ring-1 ring-border">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dict.install.privacyNote}
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
