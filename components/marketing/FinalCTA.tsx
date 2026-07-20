"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(126,214,188,0.14),transparent_65%)]"
      />
      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.3rem] lg:leading-[1.05]">
              Protect the decision you are making today.
            </h2>
            <p className="mx-auto mt-5 max-w-[36rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Put BetClear in place before the next difficult moment arrives.
              You do not have to rely on willpower every time.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href={SITE.startHref}
                size="lg"
                onClick={() => trackEvent("final_cta_clicked")}
              >
                {SITE.ctaPrimary}
              </Button>
              <Button href="/install" variant="secondary" size="lg" showArrow={false}>
                View installation guide
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{SITE.ctaMicrocopy}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
