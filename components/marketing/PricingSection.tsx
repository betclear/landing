"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { Check } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { PRICING, SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  useEffect(() => {
    if (inView) trackEvent("pricing_viewed");
  }, [inView]);

  return (
    <section id="pricing" ref={ref} className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="Start with a 7-day free trial."
            description="Choose annual or monthly after a short personalized setup. Cancel anytime before the trial ends."
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mx-auto mt-12 max-w-lg rounded-[2rem] bg-card p-7 ring-1 ring-border sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
                  {PRICING.name}
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
                  {PRICING.priceLabel}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{PRICING.cadence}</p>
              </div>
              <span className="rounded-full bg-primary/12 px-3 py-1 text-[11px] font-medium text-primary">
                {PRICING.status}
              </span>
            </div>

            <ul className="mt-8 space-y-3">
              {PRICING.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check
                    size={16}
                    weight="bold"
                    className="mt-0.5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {PRICING.note}
            </p>

            <Button
              href={SITE.startHref}
              size="lg"
              className="mt-8 w-full"
              showArrow={false}
              onClick={() => trackEvent("hero_cta_clicked", { source: "pricing" })}
            >
              Start my free trial
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
