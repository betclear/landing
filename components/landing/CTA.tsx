import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-accent px-6 py-14 text-center text-white shadow-elevated sm:px-12 dark:bg-card dark:text-foreground">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(10,132,255,0.28),transparent_55%)]"
            />
            <div className="relative mx-auto max-w-xl">
              <h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Ready to stop gambling?
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-white/65 dark:text-muted-foreground">
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
