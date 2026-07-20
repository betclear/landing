import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/shared/Reveal";
import { HOW_IT_WORKS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      title="Protection in three quiet steps"
      description="No apps to manage. No willpower games. Just a profile that keeps gambling sites out of reach."
    >
      <ol className="divide-y divide-border border-y border-border">
        {HOW_IT_WORKS.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <li className="grid gap-3 py-8 sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-10">
              <span className="font-mono text-sm tabular-nums text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[42rem] text-[15px] leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
