import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { PROTECTION_LAYERS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function ProtectionStack() {
  return (
    <section id="support" className="bg-soft py-24 text-soft-foreground sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            tone="soft"
            eyebrow="Layered protection"
            title="Stronger protection comes from more than one barrier."
            description="BetClear is designed to be the first immediate layer. It works best alongside other steps that reduce access to gambling."
          />
        </Reveal>

        <ol className="mt-14 space-y-3">
          {PROTECTION_LAYERS.map((layer, index) => (
            <Reveal key={layer.title} delay={index * 0.03}>
              <li
                className={cn(
                  "grid gap-3 rounded-[1.5rem] px-5 py-5 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6 sm:px-6",
                  layer.active
                    ? "bg-[#102022] text-[#f5f7f3]"
                    : "bg-white/70 text-[#102022]",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium",
                    layer.active
                      ? "bg-[#7ed6bc] text-[#102022]"
                      : "bg-[#102022]/08 text-[#102022]",
                  )}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em]">
                    {layer.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-1.5 text-sm leading-relaxed",
                      layer.active ? "text-[#a9bab6]" : "text-[#4d6460]",
                    )}
                  >
                    {layer.detail}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
