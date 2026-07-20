import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { FEATURE_STORIES } from "@/lib/constants";
import { cn } from "@/lib/cn";

const visuals: Record<string, ReactNode> = {
  block: (
    <div className="space-y-3">
      <div className="rounded-2xl bg-background/40 px-4 py-3 text-sm text-muted-foreground ring-1 ring-border">
        Request → betexample.com
      </div>
      <div className="rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary ring-1 ring-primary/30">
        BetClear protection layer
      </div>
      <div className="rounded-2xl bg-background/40 px-4 py-3 text-sm text-muted-foreground ring-1 ring-border">
        Response → blocked
      </div>
    </div>
  ),
  persistent: (
    <div className="rounded-[1.6rem] bg-background/35 p-5 ring-1 ring-border">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Background state
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
        Always configured
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        No daily switch. No session to remember. The profile stays installed until you remove it.
      </p>
    </div>
  ),
  blocklist: (
    <div className="space-y-2 font-mono text-[12px] text-muted-foreground">
      {[
        "sportsbook-new.example",
        "casino-mirror.example",
        "odds-live.example",
        "bet-promo.example",
      ].map((domain, index) => (
        <div
          key={domain}
          className="flex items-center justify-between rounded-xl bg-background/35 px-3 py-2 ring-1 ring-border"
          style={{ opacity: 1 - index * 0.12 }}
        >
          <span>{domain}</span>
          <span className="text-primary">added</span>
        </div>
      ))}
    </div>
  ),
  accountability: (
    <div className="rounded-[1.6rem] bg-background/35 p-5 ring-1 ring-border">
      <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent">
        Coming soon
      </span>
      <p className="mt-4 text-lg font-semibold tracking-[-0.03em] text-foreground">
        Trusted support, not surveillance
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        A future option to notify someone you trust if protection is removed or at risk.
      </p>
    </div>
  ),
};

export function FeatureStories() {
  return (
    <section id="protection" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Core protection"
            title="Built for difficult moments, not just settings menus."
            description="Each layer is designed to keep gambling farther away when impulse is closest."
          />
        </Reveal>

        <div className="mt-14 space-y-6">
          {FEATURE_STORIES.map((feature, index) => (
            <Reveal key={feature.id} delay={index * 0.04}>
              <article
                className={cn(
                  "grid items-center gap-8 rounded-[2rem] bg-card p-6 ring-1 ring-border sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10",
                  index % 2 === 1 && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">
                    {feature.headline}
                  </h3>
                  <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-muted-foreground">
                    {feature.copy}
                  </p>
                </div>
                <div>{visuals[feature.id]}</div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
