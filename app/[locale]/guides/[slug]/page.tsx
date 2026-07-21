import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { GuideJsonLd } from "@/components/guides/GuideJsonLd";
import {
  getGuideBySlug,
  getGuidesUi,
  guidePathByLocale,
  guideSlugs,
} from "@/lib/content/guides";
import { isAppLocale, locales, type AppLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    guideSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const match = getGuideBySlug(locale, slug);
  if (!match) return {};

  return buildPageMetadata(locale, {
    pathByLocale: guidePathByLocale(match.id),
    title: match.guide.title,
    description: match.guide.description,
    keywords: match.guide.keywords,
    ogType: "article",
  });
}

export default async function GuidePage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const match = getGuideBySlug(locale, slug);
  if (!match) notFound();

  const ui = getGuidesUi(locale);

  return (
    <>
      <GuideJsonLd locale={locale} guide={match.guide} ui={ui} />
      <Header />
      <main>
        <GuideArticle locale={locale} id={match.id} guide={match.guide} ui={ui} />
      </main>
      <Footer />
    </>
  );
}
