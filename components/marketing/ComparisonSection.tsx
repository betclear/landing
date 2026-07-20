import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { COMPARISON_ROWS } from "@/lib/constants";
import { cn } from "@/lib/cn";

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-muted-foreground">{value}</span>;
  }
  return (
    <span className={value ? "text-primary" : "text-muted-foreground/50"}>
      {value ? "Yes" : "No"}
    </span>
  );
}

export function ComparisonSection() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Why BetClear is different"
            title="More than a list of blocked websites."
            description="BetClear combines persistent access protection, gambling-specific coverage, guided installation, and long-term progress into one system."
          />
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-12 overflow-x-auto rounded-[1.75rem] ring-1 ring-border">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparison of BetClear with browser extensions, basic blockers, VPN blockers, and willpower alone
              </caption>
              <thead className="bg-card">
                <tr className="border-b border-border">
                  <th scope="col" className="px-4 py-4 font-medium text-foreground sm:px-6">
                    Capability
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium text-primary">
                    BetClear
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium text-muted-foreground">
                    Browser extensions
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium text-muted-foreground">
                    Basic blockers
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium text-muted-foreground">
                    VPN blockers
                  </th>
                  <th scope="col" className="px-3 py-4 font-medium text-muted-foreground">
                    Willpower alone
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "border-b border-border/70",
                      index % 2 === 0 ? "bg-background/40" : "bg-card/40",
                    )}
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 font-medium text-foreground sm:px-6"
                    >
                      {row.feature}
                    </th>
                    <td className="px-3 py-4 font-medium">
                      <Cell value={row.betclear} />
                    </td>
                    <td className="px-3 py-4">
                      <Cell value={row.extensions} />
                    </td>
                    <td className="px-3 py-4">
                      <Cell value={row.basicBlockers} />
                    </td>
                    <td className="px-3 py-4">
                      <Cell value={row.vpnBlockers} />
                    </td>
                    <td className="px-3 py-4">
                      <Cell value={row.willpower} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
