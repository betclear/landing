import { Container } from "@/components/ui/Container";

type TrustStripProps = {
  domainCountLabel: string;
};

export function TrustStrip({ domainCountLabel }: TrustStripProps) {
  const items = [
    {
      title: `${domainCountLabel} sites blocked`,
      detail: "Gambling-specific coverage from multiple blocklist sources.",
    },
    {
      title: "Works across your iPhone",
      detail: "Protection applies across Safari and supported apps using system DNS.",
    },
    {
      title: "Updated automatically",
      detail: "New gambling domains can be added without reinstalling.",
    },
    {
      title: "Guided installation",
      detail: "Clear step-by-step setup on iPhone.",
    },
  ];

  return (
    <section aria-label="Product proof" className="border-y border-border/70 py-7">
      <Container>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.title} className="min-w-0">
              <p className="text-[14px] font-semibold tracking-[-0.02em] text-foreground">
                {item.title}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
