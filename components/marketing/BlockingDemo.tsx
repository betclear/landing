"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import {
  BlockedSiteScreen,
  GamblingAttemptScreen,
  PhoneFrame,
  ProtectionStatusScreen,
} from "@/components/marketing/PhoneFrame";
import { BLOCKING_STAGES } from "@/lib/constants";
import { cn } from "@/lib/cn";

const screens = [
  <GamblingAttemptScreen key="urge" />,
  <BlockedSiteScreen key="barrier" />,
  <ProtectionStatusScreen key="passes" />,
];

export function BlockingDemo() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % BLOCKING_STAGES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Product demonstration"
            title="The bet stops before it begins."
            description="A short sequence of what happens when temptation meets protection."
          />
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <ol className="space-y-3">
              {BLOCKING_STAGES.map((stage, index) => {
                const selected = active === index;
                return (
                  <li key={stage.id}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className={cn(
                        "w-full rounded-[1.5rem] px-5 py-4 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        selected
                          ? "bg-card ring-1 ring-primary/40"
                          : "bg-transparent hover:bg-surface/70",
                      )}
                      aria-current={selected ? "step" : undefined}
                    >
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                        Stage {index + 1}
                      </p>
                      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">
                        {stage.label}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {stage.description}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <Reveal delay={0.08} className="relative">
            <div className="mx-auto max-w-[320px]">
              <PhoneFrame>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className="h-full"
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {screens[active]}
                  </motion.div>
                </AnimatePresence>
              </PhoneFrame>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
