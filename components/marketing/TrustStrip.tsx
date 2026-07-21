"use client";

import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";

type TrustStripProps = {
  domainCountLabel: string;
};

export function TrustStrip({ domainCountLabel }: TrustStripProps) {
  const { t } = useLocale();

  const items = [
    {
      title: t("trust.domainsTitle", { domainCount: domainCountLabel }),
      detail: t("trust.domainsDetail"),
    },
    {
      title: t("trust.worksTitle"),
      detail: t("trust.worksDetail"),
    },
    {
      title: t("trust.updatedTitle"),
      detail: t("trust.updatedDetail"),
    },
    {
      title: t("trust.guidedTitle"),
      detail: t("trust.guidedDetail"),
    },
  ];

  return (
    <section aria-label={t("trust.ariaLabel")} className="border-y border-border/70 py-7">
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
