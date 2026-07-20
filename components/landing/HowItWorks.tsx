import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/shared/Reveal";
import { HOW_IT_WORKS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Protection in three quiet steps"
      description="No apps to manage. No willpower games. Just a profile that keeps gambling sites out of reach."
    >
      <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
        {HOW_IT_WORKS.map((item, index) => (
          <Reveal key={item.step} delayMs={index * 80}>
            <Card as="li" className="h-full">
              <p className="text-sm font-medium tracking-[-0.01em] text-primary">
                {item.step}
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
