import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";
import { localizePath } from "@/lib/i18n/routing";

type BlogCtaProps = {
  title?: string;
  body?: string;
};

/** Conversion block linking blog readers into onboarding. */
export function BlogCta({ title, body }: BlogCtaProps) {
  const startHref = localizePath("en", SITE.startHref);

  return (
    <aside className="my-12 overflow-hidden rounded-[var(--radius-lg)] bg-[#081113] p-8 text-[#f5f7f3]">
      <h2 className="text-2xl font-semibold tracking-[-0.03em]">
        {title ?? "Make the next bet harder to reach"}
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#a9bab6]">
        {body ??
          "BetClear blocks 348,000+ gambling websites across your iPhone, so the urge has nowhere to go. Install once and stay protected automatically — start with a 7-day free trial."}
      </p>
      <div className="mt-6">
        <Button href={startHref} size="lg">
          {SITE.ctaPrimary}
        </Button>
      </div>
    </aside>
  );
}
