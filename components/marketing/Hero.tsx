"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  BlockedSiteScreen,
  GamblingAttemptScreen,
  PhoneFrame,
  ProtectionStatusScreen,
} from "@/components/marketing/PhoneFrame";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

type HeroProps = {
  domainCountLabel: string;
};

export function Hero({ domainCountLabel }: HeroProps) {
  const reduce = useReducedMotion();
  const { t } = useLocale();

  useEffect(() => {
    trackEvent("homepage_viewed");
  }, []);

  return (
    <section className="relative overflow-hidden pb-14 pt-6 sm:pb-20 sm:pt-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_68%)]" />
        <div className="absolute inset-0 marketing-grain opacity-25" />
      </div>

      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="max-w-xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-primary">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-3 text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.055em] text-foreground sm:text-5xl lg:text-[3.35rem] lg:leading-[1.02]">
            {t("hero.title", { domainCount: domainCountLabel })}
          </h1>
          <p className="mt-4 max-w-[34rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("hero.description")}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={"/onboarding/spend"}
              size="lg"
              onClick={() => {
                trackEvent("hero_start_protection_clicked");
                trackEvent("hero_cta_clicked", { source: "hero" });
              }}
            >
              {t("hero.primaryCta")}
            </Button>
            <Button
              href={"/#how-it-works"}
              variant="secondary"
              size="lg"
              showArrow={false}
              onClick={() => {
                trackEvent("hero_how_it_works_clicked");
                trackEvent("how_it_works_clicked");
              }}
            >
              {t("hero.secondaryCta")}
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("hero.microcopy")}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="relative flex items-end justify-center">
            <motion.div
              className="relative z-20 w-[70%] max-w-[280px]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <PhoneFrame>
                <BlockedSiteScreen />
              </PhoneFrame>
            </motion.div>

            <motion.div
              className="absolute left-0 top-8 hidden w-[42%] max-w-[180px] opacity-80 sm:block"
              initial={reduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="scale-[0.88]">
                <PhoneFrame>
                  <GamblingAttemptScreen />
                </PhoneFrame>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-0 top-10 hidden w-[42%] max-w-[180px] sm:block"
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="scale-[0.88]">
                <PhoneFrame>
                  <ProtectionStatusScreen />
                </PhoneFrame>
              </div>
            </motion.div>
          </div>

          <p className="mx-auto mt-5 max-w-sm rounded-full bg-card/80 px-4 py-2 text-center text-[12px] text-muted-foreground ring-1 ring-border">
            {t("hero.visualCaption")}
          </p>
        </div>
      </Container>
    </section>
  );
}
