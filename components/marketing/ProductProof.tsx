import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

type ProductProofProps = {
  domainCountLabel: string;
  sourcesSucceeded: number;
};

export function ProductProof({
  domainCountLabel,
  sourcesSucceeded,
}: ProductProofProps) {
  const proofs = [
    {
      title: `${domainCountLabel} domains in the current gambling list`,
      detail: "Real count from BetClear’s latest blocklist build metadata.",
    },
    {
      title: `${sourcesSucceeded} successful source feeds in the latest build`,
      detail: "Coverage is assembled from multiple gambling-domain providers plus custom entries.",
    },
    {
      title: "Guided iPhone profile installation",
      detail: "Download, Settings approval, and verification are documented on the install page.",
    },
    {
      title: "Compatibility focus: system DNS on iPhone",
      detail: "Protection is designed for Safari and apps that honor managed DNS settings.",
    },
  ];

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Product proof"
            title="Built around a decision that still needs protection later."
            description="Public reviews are not published yet. Until then, here is what is verified in the product today."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {proofs.map((proof, index) => (
            <Reveal key={proof.title} delay={index * 0.04}>
              <article className="h-full rounded-[1.6rem] bg-card p-6 ring-1 ring-border">
                <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                  {proof.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {proof.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <blockquote className="mt-10 max-w-3xl rounded-[1.75rem] bg-surface p-6 ring-1 ring-border sm:p-8">
            <p className="text-xl font-medium tracking-[-0.035em] text-foreground sm:text-2xl">
              “BetClear was built around a simple truth: a decision made in a clear moment should still have protection behind it when the difficult moment arrives.”
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              — Founder statement
            </footer>
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}
