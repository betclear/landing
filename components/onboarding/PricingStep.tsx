"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { getPlanDisplay } from "@/lib/stripe/prices";
import type { PlanId } from "@/lib/onboarding/types";
import { cn } from "@/lib/cn";

export function PricingStep() {
  const router = useRouter();
  const { locale, href, t } = useLocale();
  const { state, setPlan, setStep } = useOnboarding();
  const [busy, setBusy] = useState(false);

  const annual = getPlanDisplay(locale, "annual");
  const monthly = getPlanDisplay(locale, "monthly");

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
    router.push(href("/auth"));
  }

  const annualPrice = annual.formattedAmount!;
  const monthlyPrice = monthly.formattedAmount!;

  return (
    <OnboardingShell
      step={6}
      backHref="/onboarding/impact"
      title={t("onboarding.pricing.title")}
      description={t("onboarding.pricing.description")}
      footer={
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full justify-center"
            showArrow={false}
            disabled={busy}
            onClick={continueNext}
          >
            {t("onboarding.pricing.trialCta")}
          </Button>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {t("onboarding.pricing.cancelNote")}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            <Link href={href("/terms")} className="underline underline-offset-2">
              {t("common.terms")}
            </Link>
            {" · "}
            <Link href={href("/privacy")} className="underline underline-offset-2">
              {t("common.privacyPolicy")}
            </Link>
            {" · "}
            <Link
              href={href("/terms#billing")}
              className="underline underline-offset-2"
            >
              {t("common.billingTerms")}
            </Link>
          </p>
        </div>
      }
    >
      <div className="space-y-3">
        <PlanCard
          plan="annual"
          planLabel={t("onboarding.pricing.annualPlan")}
          selected={state.selectedPlan === "annual"}
          onSelect={() => selectPlan("annual")}
          badge={t("onboarding.pricing.bestValue")}
          savingBadge={
            annual.savingsPercent != null
              ? t("onboarding.pricing.savePercent", {
                  percent: annual.savingsPercent,
                })
              : undefined
          }
          price={annualPrice}
          equivalent={annual.equivalentLabel ?? undefined}
          description={t("onboarding.pricing.annualDescription", {
            price: annualPrice,
          })}
        />
        <PlanCard
          plan="monthly"
          planLabel={t("onboarding.pricing.monthlyPlan")}
          selected={state.selectedPlan === "monthly"}
          onSelect={() => selectPlan("monthly")}
          price={monthlyPrice}
          description={t("onboarding.pricing.monthlyDescription", {
            price: monthlyPrice,
          })}
        />
      </div>
    </OnboardingShell>
  );
}

function PlanCard({
  plan: _plan,
  planLabel,
  selected,
  onSelect,
  badge,
  savingBadge,
  price,
  equivalent,
  description,
}: {
  plan: PlanId;
  planLabel: string;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
  savingBadge?: string;
  price: string;
  equivalent?: string;
  description: string;
}) {
  void _plan;
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
          <p className="text-sm font-medium text-muted-foreground">
            {planLabel}
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
