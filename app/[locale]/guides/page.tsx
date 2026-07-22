import { Link } from "@/lib/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { getGuidesUi, listGuides } from "@/lib/content/guides";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { getPathname } from "@/lib/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const ui = getGuidesUi(locale);
  const keywords = listGuides(locale).map((guide) => guide.cardTitle);

  return buildPageMetadata(locale, {
    path: "/guides",
    title: ui.hubTitle,
    description: ui.hubDescription,
    keywords,
  });
}

export default async function GuidesHubPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const ui = getGuidesUi(locale);
  const guides = listGuides(locale);

  return (
    <>
      <Header />
      <main className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
            {ui.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            {ui.hubTitle}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {ui.hubDescription}
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={getPathname({ locale: locale, href: `/guides/${guide.slug}` })}
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                  {guide.cardTitle}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {ui.readMore}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-12 rounded-[var(--radius-md)] border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted-foreground">
            {ui.disclaimer}
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
