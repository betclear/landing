"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  BlockedSiteScreen,
  PhoneFrame,
  ProtectionStatusScreen,
} from "@/components/marketing/PhoneFrame";
import { SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export function Hero() {
  const reduce = useReducedMotion();

  useEffect(() => {
    trackEvent("homepage_viewed");
  }, []);

  return (
    <section className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_68%)]" />
        <div className="absolute inset-0 marketing-grain opacity-25" />
      </div>

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="max-w-xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-primary">
            Protection for the moments that matter
          </p>
          <h1 className="mt-4 text-balance text-[2.15rem] font-semibold leading-[1.05] tracking-[-0.055em] text-foreground sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
            {SITE.tagline}
          </h1>
          <p className="mt-5 max-w-[34rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {SITE.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={SITE.startHref}
              size="lg"
              onClick={() => trackEvent("hero_cta_clicked", { source: "hero" })}
            >
              {SITE.ctaPrimary}
            </Button>
            <Button
              href="#how-it-works"
              variant="secondary"
              size="lg"
              showArrow={false}
              onClick={() => trackEvent("how_it_works_clicked")}
            >
              {SITE.ctaSecondary}
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{SITE.ctaMicrocopy}</p>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <div className="relative flex items-end justify-center gap-[-40px]">
            <motion.div
              className="relative z-20 w-[72%] max-w-[300px]"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <PhoneFrame>
                <BlockedSiteScreen />
              </PhoneFrame>
            </motion.div>

            <motion.div
              className="absolute right-0 top-10 hidden w-[48%] max-w-[220px] sm:block"
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="scale-[0.92] opacity-90">
                <PhoneFrame>
                  <ProtectionStatusScreen />
                </PhoneFrame>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mx-auto mt-6 max-w-sm rounded-full bg-card/80 px-4 py-2 text-center text-[12px] text-muted-foreground ring-1 ring-border backdrop-blur"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            A gambling attempt happens. BetClear stops it.
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
