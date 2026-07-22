"use client";

import { useEffect, useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import {
  PROTECTION_DURATION_OPTIONS,
  planForProtectionDuration,
  type ProtectionDurationMonths,
} from "@/lib/onboarding/types";
import { cn } from "@/lib/cn";

const RESEARCH_URL = "https://pubmed.ncbi.nlm.nih.gov/10885052/";

const DURATION_COPY_KEYS = {
  1: {
    months: "oneMonth",
    label: "oneMonthLabel",
    description: "oneMonthDescription",
  },
  3: {
    months: "threeMonths",
    label: "threeMonthsLabel",
    description: "threeMonthsDescription",
  },
  6: {
    months: "sixMonths",
    label: "sixMonthsLabel",
    description: "sixMonthsDescription",
  },
  12: {
    months: "twelveMonths",
    label: "twelveMonthsLabel",
    description: "twelveMonthsDescription",
  },
} as const;

export function ProtectionPeriodStep() {
  const router = useRouter();
  const { href, t } = useLocale();
  const { state, update, setStep, setPlan } = useOnboarding();
  const groupLabelId = useId();
  const questionId = useId();
  const defaultSelectionRef = useRef(
    state.protectionDurationMonths === 12,
  );
  const viewedRef = useRef(false);

  const selected = state.protectionDurationMonths;

  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackEvent("protection_period_viewed", {
      step: "protection-period",
      selected_months: selected,
      default_selection: defaultSelectionRef.current,
    });
  }, [selected]);

  function selectDuration(months: ProtectionDurationMonths) {
    update({ protectionDurationMonths: months });
    setPlan(planForProtectionDuration(months));
    trackEvent("protection_period_selected", {
      step: "protection-period",
      selected_months: months,
      default_selection: months === 12 && defaultSelectionRef.current,
    });
  }

  function continueNext() {
    const months = state.protectionDurationMonths;
    const plan = planForProtectionDuration(months);
    update({ protectionDurationMonths: months });
    setPlan(plan);
    setStep(7);
    trackEvent("protection_period_continued", {
      step: "protection-period",
      selected_months: months,
      default_selection: months === 12 && defaultSelectionRef.current,
      preselected_plan: plan,
    });
    router.push(href("/onboarding/pricing"));
  }

  return (
    <OnboardingShell
      step={6}
      backHref="/onboarding/impact"
      eyebrow={t("onboarding.protectionPeriod.eyebrow")}
      title={t("onboarding.protectionPeriod.title")}
      footer={
        <Button
          size="lg"
          className="w-full justify-center"
          showArrow={false}
          onClick={continueNext}
        >
          {t("onboarding.protectionPeriod.continue")}
        </Button>
      }
    >
      <div className="space-y-8">
        <section
          aria-label={t("onboarding.protectionPeriod.researchAria")}
          className="rounded-[22px] bg-card px-5 py-6 ring-1 ring-primary/25 sm:px-6"
        >
          <p className="text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
            {t("onboarding.protectionPeriod.statValue")}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground">
            {t("onboarding.protectionPeriod.statBody")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("onboarding.protectionPeriod.statClarification")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <span>{t("onboarding.protectionPeriod.sourcePrefix")} </span>
            <a
              href={RESEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("onboarding.protectionPeriod.sourceName")}
            </a>
            <span> · </span>
            <a
              href={RESEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("onboarding.protectionPeriod.viewResearch")}
            </a>
          </p>
        </section>

        <section aria-labelledby={questionId}>
          <h2
            id={questionId}
            className="text-balance text-xl font-semibold tracking-[-0.03em] text-foreground"
          >
            {t("onboarding.protectionPeriod.question")}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {t("onboarding.protectionPeriod.questionDescription")}
          </p>

          <div
            role="radiogroup"
            aria-labelledby={`${questionId} ${groupLabelId}`}
            className="mt-5 space-y-3"
          >
            <p id={groupLabelId} className="sr-only">
              {t("onboarding.protectionPeriod.question")}
            </p>
            {PROTECTION_DURATION_OPTIONS.map((months) => {
              const keys = DURATION_COPY_KEYS[months];
              const isSelected = selected === months;
              const isRecommended = months === 12;

              return (
                <button
                  key={months}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => selectDuration(months)}
                  className={cn(
                    "w-full rounded-[22px] p-4 text-left transition-all sm:p-5",
                    "ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isSelected
                      ? "bg-primary/12 ring-primary"
                      : "bg-card/70 ring-border hover:bg-surface",
                    isRecommended && !isSelected && "ring-primary/35",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                        {t(`onboarding.protectionPeriod.${keys.months}`)}
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {t(`onboarding.protectionPeriod.${keys.label}`)}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {t(`onboarding.protectionPeriod.${keys.description}`)}
                      </p>
                    </div>
                    {isRecommended ? (
                      <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                        {t("onboarding.protectionPeriod.recommended")}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("onboarding.protectionPeriod.cancelNote")}
        </p>
      </div>
    </OnboardingShell>
  );
}
