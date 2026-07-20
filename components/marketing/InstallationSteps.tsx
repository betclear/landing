"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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
    <section id="install" ref={ref} className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Installation"
            title="Protected in a few guided steps."
            description="Installing an iPhone configuration profile can feel unfamiliar. BetClear keeps each step clear and concrete."
          />
        </Reveal>

        <ol className="mt-14 grid gap-4 md:grid-cols-2">
          {INSTALLATION_STEPS.map((step, index) => (
            <Reveal key={step.step} delay={index * 0.04}>
              <li className="h-full rounded-[1.75rem] bg-card p-6 ring-1 ring-border sm:p-7">
                <p className="font-mono text-[12px] text-primary">{step.step}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-4 rounded-[1.75rem] bg-surface p-6 ring-1 ring-border sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-base font-medium tracking-[-0.02em] text-foreground">
                BetClear does not gain access to your photos, messages, passwords, or personal files.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                The profile configures encrypted DNS for gambling-domain protection.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Button
                href={SITE.startHref}
                size="lg"
                onClick={() =>
                  trackEvent("installation_guide_opened", { source: "install_section" })
                }
              >
                Start installation
              </Button>
              <Link
                href="/install"
                className="text-sm text-primary underline-offset-4 hover:underline"
                onClick={() => trackEvent("installation_guide_opened")}
              >
                View detailed installation guide
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
