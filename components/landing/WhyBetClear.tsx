import Image from "next/image";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/shared/Reveal";
import { FEATURES } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function WhyBetClear() {
  return (
    <Section
      id="why"
      title="Built to remove temptation"
      description="A system-level approach that works with Apple's tools, not against them."
    >
      <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2 md:gap-5">
        <Reveal className="md:col-span-4 md:row-span-2">
          <article className="relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-[var(--radius-xl)] bg-foreground p-6 text-white sm:min-h-[420px] sm:p-8 dark:bg-card dark:ring-1 dark:ring-border">
            <Image
              src="/images/feature-atmosphere.png"
              alt=""
              fill
              className="object-cover opacity-45"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
            <div className="relative">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Check size={18} weight="bold" />
              </div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {FEATURES[0].title}
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
                {FEATURES[0].description}
              </p>
            </div>
          </article>
        </Reveal>

        {FEATURES.slice(1).map((feature, index) => (
          <Reveal
            key={feature.title}
            delay={(index + 1) * 0.05}
            className="md:col-span-2"
          >
            <article
              className={cn(
                "flex h-full flex-col rounded-[var(--radius-xl)] p-6 ring-1 ring-border",
                feature.tone === "dark"
                  ? "bg-accent text-white dark:bg-foreground dark:text-background"
                  : "bg-card shadow-soft",
              )}
            >
              <div
                className={cn(
                  "mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full",
                  feature.tone === "dark"
                    ? "bg-white/10 text-white"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Check size={16} weight="bold" />
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.02em]">
                {feature.title}
              </h3>
              <p
                className={cn(
                  "mt-2 text-[15px] leading-relaxed",
                  feature.tone === "dark"
                    ? "text-white/65 dark:text-background/65"
                    : "text-muted-foreground",
                )}
              >
                {feature.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
