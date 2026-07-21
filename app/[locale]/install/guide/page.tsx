import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { InstallGuide } from "@/components/install/InstallGuide";
import { profileDownloadPath } from "@/lib/stripe/access";
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
    path: "/install/guide",
    title: dict.meta.installGuideTitle,
    description: dict.meta.installGuideDescription,
  });
}

export default async function InstallGuidePage({
  params,
  searchParams,
}: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();

  const { access } = await searchParams;
  const profileUrl = profileDownloadPath(access);

  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container className="max-w-2xl">
          <InstallGuide profileUrl={profileUrl} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
