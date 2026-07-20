import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IPhoneMockup } from "@/components/landing/IPhoneMockup";
import { Reveal } from "@/components/shared/Reveal";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(10,132,255,0.08),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(10,132,255,0.14),transparent_55%)]"
      />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <div className="max-w-xl">
            <p className="text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
              {SITE.name}
            </p>
            <h1 className="mt-4 text-balance text-[1.75rem] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              {SITE.tagline}
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {SITE.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/pricing" size="lg">
                Get Protected
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={120} className="lg:justify-self-end">
          <IPhoneMockup />
        </Reveal>
      </Container>
    </section>
  );
}
