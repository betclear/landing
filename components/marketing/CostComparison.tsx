"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { getPlanDisplay } from "@/lib/stripe/prices";

export function CostComparison() {
  const { locale, t, href } = useLocale();
  const monthly = getPlanDisplay(locale, "monthly");
  const annual = getPlanDisplay(locale, "annual");
  const monthlyPrice = monthly.formattedAmount!;
  const annualPrice = annual.formattedAmount!;

  return (
    <section id="progress" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={t("progress.eyebrow")}
            title={t("progress.title", { monthlyPrice })}
            description={t("progress.description")}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-card p-6 ring-1 ring-primary/35">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-primary">
                {t("progress.betclearLabel")}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {monthlyPrice}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("progress.betclearDetail", { annualPrice })}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-surface p-6 ring-1 ring-border">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {t("progress.exampleLabel")}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {t("progress.exampleTitle")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("progress.exampleDetail")}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8">
            <Button
              href={href("/onboarding/spend")}
              size="lg"
              onClick={() => trackEvent("cost_comparison_cta_clicked")}
            >
              {t("progress.cta")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
