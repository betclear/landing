"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { trackEvent } from "@/lib/analytics";
import { calculateImpactEstimates } from "@/lib/onboarding/calculations";
import { formatCurrencyAmount } from "@/lib/onboarding/currency";

export function ImpactStep() {
  const router = useRouter();
  const { state, setStep } = useOnboarding();

  const spend = state.monthlyGamblingSpend ?? 0;
  const hours = state.weeklyGamblingHours ?? 0;
  const estimates = calculateImpactEstimates(spend, hours);

  useEffect(() => {
    trackEvent("onboarding_impact_viewed", {
      currency: state.currency,
      step: "impact",
    });
  }, [state.currency]);

  function continueNext() {
    setStep(6);
    router.push("/onboarding/pricing");
  }

  const dayWord = estimates.displayDays === 1 ? "day" : "days";

  return (
    <OnboardingShell
      step={5}
      backHref="/onboarding/confirm-date"
      title="Here’s what gambling may be costing you"
      description="Betclear helps you block gambling access and track every day, dollar, and hour you take back."
      footer={
        <Button
          size="lg"
          className="w-full justify-center"
          showArrow={false}
          onClick={continueNext}
        >
          Protect my progress
        </Button>
      }
    >
      <div className="space-y-3">
        <Metric
          value={formatCurrencyAmount(estimates.displaySpend, state.currency)}
          label="per year"
        />
        <Metric
          value={`${estimates.displayHours.toLocaleString()} hours`}
          label="per year"
        />
        <Metric
          value={`${estimates.displayDaysLabel} full ${dayWord}`}
          label="of your time"
        />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Estimates are based on the information you provided.
      </p>
    </OnboardingShell>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[22px] bg-card/70 px-5 py-4 ring-1 ring-border">
      <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
