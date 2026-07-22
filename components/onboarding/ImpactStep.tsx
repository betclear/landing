"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { calculateImpactEstimates } from "@/lib/onboarding/calculations";
import { formatCurrencyAmount } from "@/lib/onboarding/currency";

export function ImpactStep() {
  const router = useRouter();
  const { t  } = useLocale();
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
    router.push("/onboarding/protection-period");
  }

  const dayWord =
    estimates.displayDays === 1
      ? t("onboarding.impact.day")
      : t("onboarding.impact.days");

  return (
    <OnboardingShell
      step={5}
      backHref="/onboarding/confirm-date"
      title={t("onboarding.impact.title")}
      description={t("onboarding.impact.description")}
      footer={
        <Button
          size="lg"
          className="w-full justify-center"
          showArrow={false}
          onClick={continueNext}
        >
          {t("onboarding.impact.continue")}
        </Button>
      }
    >
      <div className="space-y-3">
        <Metric
          value={formatCurrencyAmount(estimates.displaySpend, state.currency)}
          label={t("onboarding.impact.moneySavedLabel")}
        />
        <Metric
          value={t("onboarding.impact.hoursUnit", {
            hours: estimates.displayHours.toLocaleString(),
          })}
          label={t("onboarding.impact.timeSavedLabel")}
        />
        <Metric
          value={t("onboarding.impact.fullDays", {
            days: estimates.displayDaysLabel,
            dayWord,
          })}
          label={t("onboarding.impact.daysLabel")}
        />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        {t("onboarding.impact.estimatesNote")}
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
