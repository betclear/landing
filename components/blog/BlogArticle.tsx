import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BlogCta } from "@/components/blog/BlogCta";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";
import {
  getRelatedPosts,
  readingMinutes,
  type BlogBlock,
  type BlogPost,
  type BlogPostId,
} from "@/lib/content/blog";
import type { BlogUi } from "@/lib/content/blog";
import type { AppLocale } from "@/lib/i18n/config";
import { getPathname } from "@/lib/i18n/navigation";

type BlogArticleProps = {
  locale: AppLocale;
  id: BlogPostId;
  post: BlogPost;
  ui: BlogUi;
};

function formatDate(locale: AppLocale, iso: string): string {
  return new Intl.DateTimeFormat(locale === "br" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="mt-10 text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="mt-5 space-y-2.5">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-base leading-relaxed text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-primary pl-5 text-lg font-medium italic leading-relaxed text-foreground">
          {block.text}
          {block.cite ? (
            <cite className="mt-2 block text-sm not-italic text-muted-foreground">
              — {block.cite}
            </cite>
          ) : null}
        </blockquote>
      );
    default:
      return null;
  }
}

export function BlogArticle({ locale, id, post, ui }: BlogArticleProps) {
  const blogHref = getPathname({ locale: locale, href: "/blog" });
  const startHref = getPathname({ locale: locale, href: SITE.startHref });
  const related = getRelatedPosts(locale, post, id);
  const minutes = readingMinutes(post);
  // Insert the conversion CTA after the intro so it sits high on most posts.
  const ctaAfter = Math.min(3, post.body.length);

  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-2xl">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href={blogHref} className="hover:text-foreground">
            {ui.breadcrumbBlog}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{post.category}</span>
        </nav>

        <header className="mt-6">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
            {post.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {post.author} · {formatDate(locale, post.datePublished)} · {minutes}{" "}
            {ui.minRead}
          </p>
        </header>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.heroImage}
          alt={post.heroAlt}
          width={1200}
          height={675}
          className="mt-8 aspect-video w-full rounded-[var(--radius-lg)] object-cover"
        />

        <div className="mt-2">
          {post.body.map((block, index) => (
            <div key={index}>
              <Block block={block} />
              {index === ctaAfter - 1 ? (
                <BlogCta
                  title={ui.cta.title}
                  body={ui.cta.body}
                  button={ui.cta.button}
                  href={startHref}
                />
              ) : null}
            </div>
          ))}
        </div>

        <BlogCta
          title={ui.ctaClosing.title}
          body={ui.ctaClosing.body}
          button={ui.cta.button}
          href={startHref}
        />

        <p className="mt-10 rounded-[var(--radius-md)] border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted-foreground">
          {ui.disclaimer}
        </p>

        {related.length > 0 ? (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
              {ui.keepReading}
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              {related.map(({ id: relatedId, post: relatedPost }) => (
                <Link
                  key={relatedId}
                  href={getPathname({ locale: locale, href: `/blog/${relatedPost.slug}` })}
                  className="group flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40"
                >
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {relatedPost.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground line-clamp-1">
                      {relatedPost.excerpt}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10">
          <Link
            href={blogHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {ui.allArticles}
          </Link>
        </div>
      </Container>
    </article>
  );
}
