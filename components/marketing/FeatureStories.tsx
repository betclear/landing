import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { CORE_FEATURES } from "@/lib/constants";

export function FeatureStories() {
  return (
    <section id="protection" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Protection"
            title="Install once. Stay protected."
            description="One setup. Ongoing gambling website blocking across your iPhone."
          />
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {CORE_FEATURES.map((feature, index) => (
            <Reveal key={feature.id} delay={index * 0.03}>
              <article className="h-full rounded-[1.4rem] bg-card p-5 ring-1 ring-border sm:p-6">
                <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 rounded-[1.4rem] bg-surface px-5 py-4 ring-1 ring-border sm:px-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Coming next
            </p>
            <p className="mt-1.5 text-sm leading-snug text-foreground">
              Track gambling-free days, estimated money protected, and add
              trusted-person accountability.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
