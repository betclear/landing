"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";

export function InsightSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="grid items-end gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-primary">
                Why BetClear exists
              </p>
              <h2 className="mt-4 max-w-[18ch] text-balance text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
                Willpower is strongest when you install BetClear — not always when the urge returns.
              </h2>
              <p className="mt-6 max-w-[42ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Gambling is often only a tap away. BetClear changes the
                environment around the decision, making access harder during the
                moments when acting impulsively feels easiest.
              </p>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] bg-card p-6 ring-1 ring-border sm:p-8">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
                  <motion.div
                    className="rounded-[1.4rem] bg-surface p-4 sm:p-5"
                    initial={reduce ? false : { opacity: 0.55 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Clear moment
                    </p>
                    <p className="mt-3 text-sm font-medium tracking-[-0.02em] text-foreground">
                      You decide gambling should stay out of reach.
                    </p>
                  </motion.div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary to-transparent sm:h-24" />
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-medium text-primary">
                      Barrier
                    </span>
                    <div className="h-16 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent sm:h-24" />
                  </div>

                  <motion.div
                    className="rounded-[1.4rem] bg-surface p-4 sm:p-5"
                    initial={reduce ? false : { opacity: 0.55, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Difficult moment
                    </p>
                    <p className="mt-3 text-sm font-medium tracking-[-0.02em] text-foreground">
                      The urge arrives. Access is interrupted.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
