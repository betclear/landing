"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { INSTALLATION_STEPS, SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export function InstallationSteps() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (inView) trackEvent("installation_section_viewed");
  }, [inView]);

  return (
    <section id="install" ref={ref} className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Simple iPhone setup"
            title="Protected in a few guided steps."
            description="A clear path from download to active blocking."
          />
        </Reveal>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2">
          {INSTALLATION_STEPS.map((step, index) => (
            <Reveal key={step.step} delay={index * 0.03}>
              <li className="h-full rounded-[1.4rem] bg-card p-5 ring-1 ring-border sm:p-6">
                <p className="font-mono text-[12px] text-primary">{step.step}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">
                  {step.detail}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-col gap-4 rounded-[1.4rem] bg-surface p-5 ring-1 ring-border sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[15px] font-medium tracking-[-0.02em] text-foreground">
                BetClear cannot access your photos, messages, passwords, or personal files.
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                The profile only configures encrypted DNS protection.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Button
                href={SITE.startHref}
                size="lg"
                showArrow={false}
                onClick={() =>
                  trackEvent("trust_installation_guide_clicked", {
                    source: "install_section",
                  })
                }
              >
                Start Installation
              </Button>
              <Link
                href={SITE.installHref}
                className="text-sm text-primary underline-offset-4 hover:underline"
                onClick={() => {
                  trackEvent("installation_guide_opened");
                  trackEvent("trust_installation_guide_clicked", {
                    source: "detailed_guide",
                  });
                }}
              >
                View Detailed Guide
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
