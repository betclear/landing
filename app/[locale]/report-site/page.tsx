import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReportSiteForm } from "@/components/report/ReportSiteForm";
import { Container } from "@/components/ui/Container";
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
    path: "/report-site",
    title: dict.reportSite.title,
    description: dict.reportSite.description,
  });
}

export default async function ReportSitePage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const dict = getDictionary(raw);

  return (
    <>
      <Header />
      <main className="py-20 sm:py-28">
        <Container className="max-w-2xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
            {dict.reportSite.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
            {dict.reportSite.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {dict.reportSite.description}
          </p>
          <ReportSiteForm />
        </Container>
      </main>
      <Footer />
    </>
  );
}
