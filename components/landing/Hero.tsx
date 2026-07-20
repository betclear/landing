import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-10 sm:pb-28 sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(10,132,255,0.09),transparent_58%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(10,132,255,0.16),transparent_58%)]"
      />

      <Container className="relative grid min-h-[min(72dvh,760px)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <div className="max-w-xl">
            <p className="text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl lg:text-5xl">
              {SITE.name}
            </p>
            <h1 className="mt-4 text-balance text-[1.65rem] font-semibold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-[2.65rem] lg:leading-[1.08]">
              {SITE.tagline}
            </h1>
            <p className="mt-5 max-w-[36rem] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {SITE.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/install" size="lg">
                Get Protected
              </Button>
              <Button
                href="#how-it-works"
                variant="secondary"
                size="lg"
                showArrow={false}
              >
                Learn More
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:justify-self-end">
          <div className="relative mx-auto w-full max-w-[360px] lg:max-w-[400px]">
            <div className="rounded-[var(--radius-2xl)] bg-foreground/[0.03] p-2 ring-1 ring-border dark:bg-white/[0.03]">
              <div className="overflow-hidden rounded-[calc(var(--radius-2xl)-0.4rem)] bg-card shadow-elevated">
                <Image
                  src="/images/hero-iphone.png"
                  alt="iPhone showing BetClear protection active"
                  width={900}
                  height={1200}
                  priority
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 90vw, 400px"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
