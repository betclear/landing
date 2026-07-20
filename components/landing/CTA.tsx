import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";

export function CTA() {
  return (
    <section className="pb-24 pt-8 sm:pb-32 sm:pt-10">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-2xl)] bg-accent px-6 py-16 text-center text-white sm:px-12 sm:py-20 dark:bg-card dark:text-foreground dark:ring-1 dark:ring-border">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(10,132,255,0.28),transparent_55%)]"
            />
            <div className="relative mx-auto max-w-xl">
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Ready to stop gambling?
              </h2>
              <p className="mx-auto mt-4 max-w-[36rem] text-pretty text-base leading-relaxed text-white/65 dark:text-muted-foreground">
                Install BetClear once. Keep gambling websites out of reach every
                day after.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="/pricing" size="lg">
                  Get Protected
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
