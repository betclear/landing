import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";
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
    path: "/terms",
    title: dict.meta.termsTitle,
    description: dict.meta.termsDescription,
  });
}

export default async function TermsPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const dict = getDictionary(raw);

  return (
    <>
      <Header />
      <main className="py-20 sm:py-28">
        <Container className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground">
            {dict.legal.termsTitle}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {dict.legal.lastUpdatedLabel}: {dict.legal.lastUpdated}
          </p>
          <div className="mt-10 space-y-10 text-base leading-relaxed text-muted-foreground">
            {dict.legal.termsSections.map((section) => (
              <section
                key={section.heading}
                id={"anchor" in section ? section.anchor : undefined}
                className="scroll-mt-24 space-y-3"
              >
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 64)}>{paragraph}</p>
                ))}
              </section>
            ))}
            <p>
              {dict.legal.questionsLabel}{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {SITE.email}
              </a>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
