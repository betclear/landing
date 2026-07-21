"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function FeatureStories() {
  const { t, dictionary } = useLocale();
  const features = dictionary.protection.features;

  return (
    <section id="protection" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={t("protection.eyebrow")}
            title={t("protection.title")}
            description={t("protection.description")}
          />
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {features.map((feature, index) => (
            <Reveal key={feature.id} delay={index * 0.03}>
              <article className="h-full rounded-[1.4rem] bg-card p-5 ring-1 ring-border sm:p-6">
                <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 rounded-[1.4rem] bg-surface px-5 py-4 ring-1 ring-border sm:px-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {t("protection.comingNextEyebrow")}
            </p>
            <p className="mt-1.5 text-sm leading-snug text-foreground">
              {t("protection.comingNextDetail")}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
