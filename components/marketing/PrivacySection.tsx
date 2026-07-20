import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { PRIVACY_POINTS } from "@/lib/constants";

export function PrivacySection() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Privacy and security"
              title="Protection without unnecessary surveillance."
              description="BetClear is built to interrupt gambling access — not to watch your life."
            />
            <Link
              href="/privacy"
              className="mt-5 inline-block text-sm text-primary underline-offset-4 hover:underline"
            >
              Read the privacy policy
            </Link>

            <div className="mt-10 space-y-4">
              {PRIVACY_POINTS.map((point) => (
                <div key={point.title} className="rounded-[1.4rem] bg-card p-5 ring-1 ring-border">
                  <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {point.detail}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[2rem] bg-card p-6 ring-1 ring-border sm:p-8">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
                How a request is handled
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  "iPhone makes a DNS request",
                  "BetClear protected DNS receives the lookup",
                  "Gambling domain is blocked",
                  "Normal website is allowed",
                ].map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[12px] font-medium text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[15px] font-medium tracking-[-0.02em] text-foreground">
                        {step}
                      </p>
                      {index < 3 ? (
                        <div className="ml-3 mt-3 h-6 w-px bg-border" aria-hidden="true" />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
