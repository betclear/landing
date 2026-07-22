import { notFound } from "next/navigation";
import { permanentRedirect } from "@/lib/i18n/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { BlogJsonLd } from "@/components/blog/BlogJsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  blogPathByLocale,
  getBlogUi,
  getPostBySlug,
  postSlugs,
} from "@/lib/content/blog";
import { isAppLocale, locales, type AppLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/i18n/metadata";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    postSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const match = getPostBySlug(locale, slug);
  if (!match) return {};

  return buildPageMetadata(locale, {
    pathByLocale: blogPathByLocale(match.id),
    title: match.post.title,
    description: match.post.description,
    keywords: match.post.keywords,
    ogType: "article",
    ogImageAlt: match.post.heroAlt,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const match = getPostBySlug(locale, slug);
  if (!match) {
    // Slugs are localized. If this slug belongs to another locale's post,
    // redirect to the correct slug for the current locale instead of 404ing.
    for (const other of locales) {
      if (other === locale) continue;
      const foreign = getPostBySlug(other, slug);
      if (foreign) {
        const target = blogPathByLocale(foreign.id)[locale];
        if (target) permanentRedirect({ href: target, locale });
      }
    }
    notFound();
  }

  const ui = getBlogUi(locale);

  return (
    <>
      <BlogJsonLd locale={locale} post={match.post} ui={ui} />
      <Header />
      <main>
        <BlogArticle locale={locale} id={match.id} post={match.post} ui={ui} />
      </main>
      <Footer />
    </>
  );
}
