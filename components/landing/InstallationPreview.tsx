import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/shared/Reveal";
import { INSTALLATION_STEPS } from "@/lib/constants";

export function InstallationPreview() {
  return (
    <Section
      id="installation"
      title="From purchase to protected"
      description="A clear path with no mystery steps. Most people finish setup in under a minute."
    >
      <Reveal>
        <ol className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] bg-border sm:grid-cols-4">
          {INSTALLATION_STEPS.map((step, index) => (
            <li
              key={step.label}
              className="bg-card p-6 sm:min-h-[220px] sm:p-7"
            >
              <span className="font-mono text-xs tabular-nums text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-base font-semibold tracking-[-0.02em] text-foreground">
                {step.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
