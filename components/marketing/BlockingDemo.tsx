"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import {
  BlockedSiteScreen,
  GamblingAttemptScreen,
  PhoneFrame,
  ProtectionStatusScreen,
} from "@/components/marketing/PhoneFrame";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/cn";

const screens = [
  <GamblingAttemptScreen key="open" />,
  <BlockedSiteScreen key="block" />,
  <ProtectionStatusScreen key="pause" />,
];

export function BlockingDemo() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % HOW_IT_WORKS_STEPS.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="The bet stops before it begins."
            description="BetClear adds a barrier between the urge to gamble and the website you are trying to open."
          />
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <ol className="space-y-2">
              {HOW_IT_WORKS_STEPS.map((step, index) => {
                const selected = active === index;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className={cn(
                        "w-full rounded-[1.35rem] px-5 py-4 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        selected
                          ? "bg-card ring-1 ring-primary/40"
                          : "hover:bg-surface/70",
                      )}
                      aria-current={selected ? "step" : undefined}
                    >
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                        Step {index + 1}
                      </p>
                      <p className="mt-1.5 text-lg font-semibold tracking-[-0.03em] text-foreground">
                        {step.label}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-muted-foreground">
                        {step.description}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal delay={0.06} className="mx-auto w-full max-w-[280px]">
            <PhoneFrame>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="h-full"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {screens[active]}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
