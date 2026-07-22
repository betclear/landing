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

const DURATION_HINT_KEYS = {
  1: "hintOneMonth",
  3: "hintThreeMonths",
  6: "hintSixMonths",
  12: "hintTwelveMonths",
} as const;

const DURATION_LABEL_KEYS = {
  1: "oneMonth",
  3: "threeMonths",
  6: "sixMonths",
  12: "twelveMonths",
} as const;

export function ProtectionPeriodStep() {
  const router = useRouter();
  const { href, t } = useLocale();
  const { state, update, setStep, setPlan } = useOnboarding();
  const sliderId = useId();
  const questionId = useId();
  const defaultSelectionRef = useRef(state.protectionDurationMonths === 3);
  const viewedRef = useRef(false);

  const selected = state.protectionDurationMonths;
  const selectedIndex = Math.max(
    0,
    PROTECTION_DURATION_OPTIONS.indexOf(selected),
  );
  const fillPercent =
    PROTECTION_DURATION_OPTIONS.length <= 1
      ? 0
      : (selectedIndex / (PROTECTION_DURATION_OPTIONS.length - 1)) * 100;

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
      default_selection: months === 3 && defaultSelectionRef.current,
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
      default_selection: months === 3 && defaultSelectionRef.current,
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
      description={t("onboarding.protectionPeriod.description")}
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
      <div className="space-y-7">
        <p className="text-sm text-muted-foreground">
          <a
            href={RESEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t("onboarding.protectionPeriod.viewResearch")}
          </a>
        </p>

        <section aria-labelledby={questionId} className="space-y-5">
          <div>
            <h2
              id={questionId}
              className="text-balance text-xl font-semibold tracking-[-0.03em] text-foreground"
            >
              {t("onboarding.protectionPeriod.question")}
            </h2>
          </div>

          <div className="rounded-[22px] bg-card px-5 py-6 ring-1 ring-border">
            <p className="text-center text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {t(
                `onboarding.protectionPeriod.${DURATION_LABEL_KEYS[selected]}`,
              )}
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {t(
                `onboarding.protectionPeriod.${DURATION_HINT_KEYS[selected]}`,
              )}
            </p>

            <div className="mt-6">
              <label htmlFor={sliderId} className="sr-only">
                {t("onboarding.protectionPeriod.question")}
              </label>
              <input
                id={sliderId}
                type="range"
                min={0}
                max={PROTECTION_DURATION_OPTIONS.length - 1}
                step={1}
                value={selectedIndex}
                onChange={(event) => {
                  const next =
                    PROTECTION_DURATION_OPTIONS[Number(event.target.value)];
                  if (next != null) selectDuration(next);
                }}
                aria-valuemin={1}
                aria-valuemax={12}
                aria-valuenow={selected}
                aria-valuetext={t(
                  `onboarding.protectionPeriod.${DURATION_LABEL_KEYS[selected]}`,
                )}
                className="protection-duration-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-surface accent-primary"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${fillPercent}%, var(--surface) ${fillPercent}%, var(--surface) 100%)`,
                }}
              />

              <div className="mt-3 grid grid-cols-4 gap-1">
                {PROTECTION_DURATION_OPTIONS.map((months) => {
                  const active = selected === months;
                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={() => selectDuration(months)}
                      className={cn(
                        "rounded-full px-1 py-1.5 text-center text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        active
                          ? "bg-primary/12 text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      aria-pressed={active}
                    >
                      {t(
                        `onboarding.protectionPeriod.${DURATION_LABEL_KEYS[months]}Short`,
                      )}
                      <span
                        className={cn(
                          "mt-0.5 block text-[10px] font-semibold",
                          months === 12 ? "text-primary" : "invisible",
                        )}
                      >
                        {t("onboarding.protectionPeriod.recommendedShort")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("onboarding.protectionPeriod.cancelNote")}
        </p>
      </div>
    </OnboardingShell>
  );
}
