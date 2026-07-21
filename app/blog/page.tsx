import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";
import { listPosts, readingMinutes } from "@/lib/content/blog";

export const dynamic = "force-static";

const TITLE = "Blog — Gambling Recovery Stories & Guides";
const DESCRIPTION =
  "Real recovery stories and practical guides on how to stop gambling, understand the addiction, and take back control — from the team behind BetClear.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  keywords: [
    "gambling recovery blog",
    "how to stop gambling",
    "gambling addiction stories",
    "quit gambling",
    "gambling self-help",
  ],
  alternates: { canonical: `${SITE.url}/blog` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/blog`,
    type: "website",
    images: [{ url: `${SITE.url}/opengraph-image` }],
  },
  robots: { index: true, follow: true },
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export default function BlogIndexPage() {
  const posts = listPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      <main className="py-12 sm:py-16">
        <Container className="max-w-4xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
            BetClear Blog
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            Recovery stories &amp; guides
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Honest stories from people who stopped gambling, and practical guides
            on breaking the cycle. If you&apos;re ready to make the next bet
            harder to reach, BetClear can help.
          </p>

          {featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              className="group mt-12 grid gap-6 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:grid-cols-2 sm:p-5"
            >
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
                  {formatDate(featured.datePublished)} ·{" "}
                  {readingMinutes(featured)} min read
                </span>
              </div>
            </Link>
          ) : null}

          {rest.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-colors hover:border-primary/40"
                >
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
                      Read story
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
            {SITE.name} is a gambling website blocker, not a medical service. If
            you need clinical or crisis support, please contact a qualified
            professional or a responsible-gambling helpline.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
