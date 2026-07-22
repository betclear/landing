import { Link } from "@/lib/i18n/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { getGuidesUi, listGuides } from "@/lib/content/guides";
import type { AppLocale } from "@/lib/i18n/config";
import { getPathname } from "@/lib/i18n/navigation";

type GuidesTeaserProps = {
  locale: AppLocale;
};

export function GuidesTeaser({ locale }: GuidesTeaserProps) {
  const ui = getGuidesUi(locale);
  const guides = listGuides(locale).slice(0, 4);
  const guidesHref = getPathname({ locale: locale, href: "/guides" });

  return (
    <section className="py-20 sm:py-28" aria-labelledby="guides-teaser-heading">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
              {ui.eyebrow}
            </p>
            <h2
              id="guides-teaser-heading"
              className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl"
            >
              {ui.hubTitle}
            </h2>
          </div>
          <Link
            href={guidesHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
          >
            {ui.backToGuides}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={getPathname({ locale: locale, href: `/guides/${guide.slug}` })}
              className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                {guide.cardTitle}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {guide.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {ui.readMore}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
