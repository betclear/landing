"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { PhoneFrame, ProgressDashboardScreen } from "@/components/marketing/PhoneFrame";
import { Reveal } from "@/components/shared/Reveal";

const metrics = [
  { label: "Protected days", value: 18, prefix: "", suffix: "" },
  { label: "Attempts blocked", value: 47, prefix: "", suffix: "" },
  { label: "Est. money protected", value: 620, prefix: "$", suffix: "" },
  { label: "Time recovered", value: 11, prefix: "", suffix: "h" },
];

function AnimatedNumber({
  value,
  prefix,
  suffix,
  active,
}: {
  value: number;
  prefix: string;
  suffix: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!active || reduce) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const frames = 36;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = frame / frames;
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(value * eased));
      if (frame >= frames) window.clearInterval(id);
    }, 24);

    return () => window.clearInterval(id);
  }, [active, reduce, value]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function ProgressSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <section id="progress" className="py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Progress"
              title="See the distance growing between you and gambling."
              description="Every protected day is evidence that the decision is holding. BetClear is building a way to turn invisible protection into visible progress."
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Sample UI shown for development. Progress tracking is coming soon.
            </p>

            <div ref={ref} className="mt-8 grid grid-cols-2 gap-3">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  className="rounded-[1.4rem] bg-card p-4 ring-1 ring-border"
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-primary">
                    <AnimatedNumber
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      active={inView}
                    />
                  </p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <PhoneFrame label="Sample progress dashboard">
              <ProgressDashboardScreen />
            </PhoneFrame>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
