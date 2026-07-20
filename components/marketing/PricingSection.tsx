"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Check } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { PRICING_FEATURES, SITE } from "@/lib/constants";
import { PLAN_PRICING } from "@/lib/stripe/prices";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type PlanId = "annual" | "monthly";

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [plan, setPlan] = useState<PlanId>("annual");

  useEffect(() => {
    if (inView) trackEvent("pricing_viewed");
  }, [inView]);

  const selectPlan = (next: PlanId) => {
    setPlan(next);
    trackEvent(
      next === "annual" ? "pricing_annual_selected" : "pricing_monthly_selected",
      { plan: next },
    );
  };

  return (
    <section id="pricing" ref={ref} className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="Start with a 7-day free trial."
            description="Choose annual or monthly protection after your personalized setup."
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mx-auto mt-10 max-w-lg rounded-[1.75rem] bg-card p-6 ring-1 ring-border sm:p-8">
            <div className="grid grid-cols-2 gap-2 rounded-full bg-surface p-1">
              <button
                type="button"
                onClick={() => selectPlan("annual")}
                className={cn(
                  "rounded-full px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  plan === "annual"
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={plan === "annual"}
              >
                Annual
              </button>
              <button
                type="button"
                onClick={() => selectPlan("monthly")}
                className={cn(
                  "rounded-full px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  plan === "monthly"
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={plan === "monthly"}
              >
                Monthly
              </button>
            </div>

            <div className="mt-6">
              {plan === "annual" ? (
                <>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                      {PLAN_PRICING.annual.priceLabel}
                    </p>
                    <span className="rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-medium text-primary">
                      Best value
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Equivalent to {PLAN_PRICING.annual.equivalentLabel}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {PLAN_PRICING.monthly.priceLabel}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Billed monthly after the trial
                  </p>
                </>
              )}
            </div>

            <ul className="mt-7 space-y-2.5">
              {PRICING_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
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

            <Button
              href={SITE.startHref}
              size="lg"
              className="mt-8 w-full"
              showArrow={false}
              onClick={() =>
                trackEvent("pricing_start_protection_clicked", { plan })
              }
            >
              {SITE.ctaPrimary}
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Cancel before the trial ends to avoid being charged.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
