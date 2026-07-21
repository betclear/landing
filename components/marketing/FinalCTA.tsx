"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

type FinalCTAProps = {
  domainCountLabel: string;
};

export function FinalCTA({ domainCountLabel }: FinalCTAProps) {
  const { t, href } = useLocale();

  return (
    <section className="relative overflow-hidden pb-24 pt-8 sm:pb-32 sm:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--glow),transparent_65%)]"
      />
      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.1rem] lg:leading-[1.05]">
              {t("finalCta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-[36rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("finalCta.description", { domainCount: domainCountLabel })}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href={href("/onboarding/spend")}
                size="lg"
                onClick={() => trackEvent("final_cta_clicked")}
              >
                {t("finalCta.primaryCta")}
              </Button>
              <Button
                href={href("/install")}
                variant="secondary"
                size="lg"
                showArrow={false}
                onClick={() => trackEvent("installation_guide_opened")}
              >
                {t("finalCta.secondaryCta")}
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("finalCta.microcopy")}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
