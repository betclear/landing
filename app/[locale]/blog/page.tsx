import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { getBlogUi, listPosts } from "@/lib/content/blog";
import { isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/i18n/metadata";
import { localizePath } from "@/lib/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) return {};
  const locale = raw as AppLocale;
  const ui = getBlogUi(locale);
  const keywords = listPosts(locale).flatMap((post) => post.title);

  return buildPageMetadata(locale, {
    path: "/blog",
    title: ui.hubTitle,
    description: ui.hubDescription,
    keywords,
  });
}

function formatDate(locale: AppLocale, iso: string): string {
  return new Intl.DateTimeFormat(locale === "br" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export default async function BlogHubPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isAppLocale(raw)) notFound();
  const locale = raw as AppLocale;
  const ui = getBlogUi(locale);
  const posts = listPosts(locale);
  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      <main className="py-12 sm:py-16">
        <Container className="max-w-4xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
            {ui.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            {ui.hubTitle}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {ui.hubDescription}
          </p>

          {featured ? (
            <Link
              href={localizePath(locale, `/blog/${featured.slug}`)}
              className="group mt-12 grid gap-6 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:grid-cols-2 sm:p-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.heroImage}
                alt={featured.heroAlt}
                width={1200}
                height={675}
                className="aspect-video w-full rounded-[var(--radius-md)] object-cover"
              />
              <div className="flex flex-col justify-center sm:pr-4">
                <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
                  {featured.category}
                </span>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <span className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {formatDate(locale, featured.datePublished)}
                </span>
              </div>
            </Link>
          ) : null}

          {rest.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={localizePath(locale, `/blog/${post.slug}`)}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-colors hover:border-primary/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.heroImage}
                    alt={post.heroAlt}
                    width={1200}
                    height={675}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
                      {post.category}
                    </span>
                    <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-foreground">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      {ui.readStory}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          <p className="mt-12 rounded-[var(--radius-md)] border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted-foreground">
            {ui.disclaimer}
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
