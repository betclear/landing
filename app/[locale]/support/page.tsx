import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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
    path: "/support",
    title: dict.support.title,
    description: dict.support.description,
  });
}

export default async function SupportPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const dict = getDictionary(raw);

  return (
    <>
      <Header />
      <main className="py-20 sm:py-28">
        <Container className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground">
            {dict.support.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {dict.support.description}
          </p>
          <div className="mt-8">
            <Button href={`mailto:${SITE.email}`} size="lg">
              {dict.support.emailCta}
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{SITE.email}</p>

          <div className="mt-12 space-y-3">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
              {dict.support.resourcesHeading}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://www.begambleaware.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {dict.footer.beGambleAware}
                </a>
              </li>
              <li>
                <a
                  href="https://www.gamblersanonymous.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {dict.footer.gamblersAnonymous}
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
