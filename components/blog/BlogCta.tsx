import { Button } from "@/components/ui/Button";

type BlogCtaProps = {
  title: string;
  body: string;
  button: string;
  href: string;
};

/** Conversion block linking blog readers into onboarding. */
export function BlogCta({ title, body, button, href }: BlogCtaProps) {
  return (
    <aside className="my-12 overflow-hidden rounded-[var(--radius-lg)] bg-[#081113] p-8 text-[#f5f7f3]">
      <h2 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#a9bab6]">
        {body}
      </p>
      <div className="mt-6">
        <Button href={href} size="lg">
          {button}
        </Button>
      </div>
    </aside>
  );
}
