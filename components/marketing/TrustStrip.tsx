import { Container } from "@/components/ui/Container";
import { TRUST_POINTS } from "@/lib/constants";

type TrustStripProps = {
  domainCountLabel: string;
};

export function TrustStrip({ domainCountLabel }: TrustStripProps) {
  const items = [
    {
      title: `${domainCountLabel} gambling domains identified`,
      detail: "Coverage assembled from multiple gambling blocklist sources.",
    },
    ...TRUST_POINTS.slice(0, 3),
  ];

  return (
    <section aria-label="Trust signals" className="border-y border-border/70 py-8">
      <Container>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.title} className="min-w-0">
              <p className="text-[14px] font-medium tracking-[-0.02em] text-foreground">
                {item.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
