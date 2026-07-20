"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export function CostComparison() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="A small barrier can prevent a much bigger loss"
            title="BetClear starts from $2.50 per month."
            description="Avoiding one gambling session could cover years of BetClear protection."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-card p-6 ring-1 ring-primary/35">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-primary">
                BetClear
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                $2.50/month
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                When billed annually at $29.99/year
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-surface p-6 ring-1 ring-border">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Example gambling spend
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Your estimate
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Personalized during onboarding from your own spend. Estimates only — not guaranteed savings.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8">
            <Button
              href={SITE.startHref}
              size="lg"
              onClick={() => trackEvent("cost_comparison_cta_clicked")}
            >
              Calculate Your Protection
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
