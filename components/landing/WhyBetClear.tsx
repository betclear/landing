import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/shared/Reveal";
import { FEATURES } from "@/lib/constants";

export function WhyBetClear() {
  return (
    <Section
      id="why"
      className="bg-surface/60"
      eyebrow="Why BetClear"
      title="Built to remove temptation, not add friction"
      description="A calm, system-level approach that works with Apple's tools—not against them."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:gap-5">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delayMs={index * 70}>
            <Card as="li" className="h-full">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
