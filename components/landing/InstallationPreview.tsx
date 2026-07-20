import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/shared/Reveal";
import { INSTALLATION_STEPS } from "@/lib/constants";

export function InstallationPreview() {
  return (
    <Section
      id="installation"
      eyebrow="Installation preview"
      title="From purchase to protected"
      description="A clear path with no mystery steps. Most people finish setup in under a minute."
    >
      <Reveal>
        <ol className="relative mx-auto max-w-xl">
          <div
            aria-hidden="true"
            className="absolute bottom-4 left-5 top-4 w-px bg-border"
          />

          {INSTALLATION_STEPS.map((step, index) => (
            <li
              key={step.label}
              className="relative grid grid-cols-[40px_1fr] items-start gap-4 py-4"
            >
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold tracking-[-0.02em] text-foreground shadow-soft">
                {index + 1}
              </div>
              <div className="pt-1.5">
                <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                  {step.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
