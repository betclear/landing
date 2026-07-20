"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { trackEvent } from "@/lib/analytics";
import { PLAN_PRICING } from "@/lib/stripe/prices";
import type { PlanId } from "@/lib/onboarding/types";
import { cn } from "@/lib/cn";

export function PricingStep() {
  const router = useRouter();
  const { state, setPlan, setStep } = useOnboarding();
  const [busy, setBusy] = useState(false);

  function selectPlan(plan: PlanId) {
    setPlan(plan);
    trackEvent("onboarding_plan_selected", { plan, step: "pricing" });
  }

  function continueNext() {
    setBusy(true);
    setStep(6);
    trackEvent("onboarding_plan_selected", {
      plan: state.selectedPlan,
      step: "pricing",
    });
    router.push("/auth");
  }

  return (
    <OnboardingShell
      step={6}
      backHref="/onboarding/impact"
      title="Choose your protection plan"
      description="Start with a 7-day free trial. Cancel anytime before it ends."
      footer={
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full justify-center"
            showArrow={false}
            disabled={busy}
            onClick={continueNext}
          >
            Start my 7-day free trial
          </Button>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Cancel anytime before the trial ends to avoid being charged.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            <Link href="/terms" className="underline underline-offset-2">
              Terms
            </Link>
            {" · "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            {" · "}
            <Link href="/terms#billing" className="underline underline-offset-2">
              Billing terms
            </Link>
          </p>
        </div>
      }
    >
      <div className="space-y-3">
        <PlanCard
          plan="annual"
          selected={state.selectedPlan === "annual"}
          onSelect={() => selectPlan("annual")}
          badge="Best value"
          savingBadge="Save 37%"
          price={PLAN_PRICING.annual.priceLabel}
          equivalent={PLAN_PRICING.annual.equivalentLabel}
          description={PLAN_PRICING.annual.description}
        />
        <PlanCard
          plan="monthly"
          selected={state.selectedPlan === "monthly"}
          onSelect={() => selectPlan("monthly")}
          price={PLAN_PRICING.monthly.priceLabel}
          description={PLAN_PRICING.monthly.description}
        />
      </div>
    </OnboardingShell>
  );
}

function PlanCard({
  plan,
  selected,
  onSelect,
  badge,
  savingBadge,
  price,
  equivalent,
  description,
}: {
  plan: PlanId;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
  savingBadge?: string;
  price: string;
  equivalent?: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-[22px] p-5 text-left ring-1 transition-all",
        selected
          ? "bg-primary/12 ring-primary"
          : "bg-card/70 ring-border hover:bg-surface",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground capitalize">
            {plan} plan
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground">
            {price}
          </p>
          {equivalent ? (
            <p className="mt-1 text-sm text-muted-foreground">{equivalent}</p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-1">
          {badge ? (
            <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[11px] font-medium text-foreground">
              {badge}
            </span>
          ) : null}
          {savingBadge ? (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-foreground">
              {savingBadge}
            </span>
          ) : null}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </button>
  );
}
