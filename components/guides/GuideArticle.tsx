import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";
import {
  getGuide,
  guideReadingMinutes,
  type GuideContent,
  type GuideId,
} from "@/lib/content/guides";
import type { GuidesUi } from "@/lib/content/guides/types";
import type { AppLocale } from "@/lib/i18n/config";
import { getPathname } from "@/lib/i18n/navigation";

type GuideArticleProps = {
  locale: AppLocale;
  id: GuideId;
  guide: GuideContent;
  ui: GuidesUi;
};

function formatUpdated(locale: AppLocale, iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale === "br" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function GuideArticle({ locale, id, guide, ui }: GuideArticleProps) {
  const guidesHref = getPathname({ locale: locale, href: "/guides" });
  const homeHref = getPathname({ locale: locale, href: "/" });
  const startHref = getPathname({ locale: locale, href: SITE.startHref });
  const minutes = guideReadingMinutes(guide);
  const related = guide.related
    .filter((relatedId) => relatedId !== id)
    .map((relatedId) => ({ id: relatedId, guide: getGuide(locale, relatedId) }));

  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href={homeHref} className="hover:text-foreground">
            {ui.breadcrumbHome}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={guidesHref} className="hover:text-foreground">
            {ui.breadcrumbGuides}
          </Link>
        </nav>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {guide.hero}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {ui.updatedLabel} {formatUpdated(locale, guide.dateModified)} · {minutes}{" "}
            {ui.minRead}
          </p>
        </header>

        <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
            {ui.tldrHeading}
          </p>
          <ul className="mt-4 space-y-3">
            {guide.tldr.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-foreground">
                <CheckCircle
                  size={18}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                {section.heading}
              </h2>
              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-2.5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-base leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-[var(--radius-lg)] bg-[#081113] p-8 text-[#f5f7f3]">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">
            {guide.cta.title}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#a9bab6]">
            {guide.cta.body}
          </p>
          <div className="mt-6">
            <Button href={startHref} size="lg">
              {guide.cta.button}
            </Button>
          </div>
        </div>

        <section className="mt-14" aria-labelledby="guide-faq-heading">
          <h2
            id="guide-faq-heading"
            className="text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl"
          >
            {ui.faqHeading}
          </h2>
          <dl className="mt-6 space-y-6">
            {guide.faq.map((item) => (
              <div key={item.question}>
                <dt className="text-base font-medium text-foreground">
                  {item.question}
                </dt>
                <dd className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 ? (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
              {ui.relatedHeading}
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              {related.map(({ id: relatedId, guide: relatedGuide }) => (
                <Link
                  key={relatedId}
                  href={getPathname({ locale: locale, href: `/guides/${relatedGuide.slug}` })}
                  className="group flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40"
                >
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {relatedGuide.cardTitle}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground line-clamp-1">
                      {relatedGuide.description}
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

        <p className="mt-12 rounded-[var(--radius-md)] border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted-foreground">
          {ui.disclaimer}
        </p>

        <div className="mt-10">
          <Link
            href={guidesHref}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {ui.backToGuides}
          </Link>
        </div>
      </Container>
    </article>
  );
}
