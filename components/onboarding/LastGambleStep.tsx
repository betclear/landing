"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OptionButton } from "@/components/onboarding/OptionButton";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { trackEvent } from "@/lib/analytics";
import {
  isFutureISODate,
  todayISODate,
  yesterdayISODate,
} from "@/lib/onboarding/dates";
import { cn } from "@/lib/cn";

type Choice = "today" | "yesterday" | "choose" | "unsure" | null;

export function LastGambleStep() {
  const router = useRouter();
  const { state, update, setStep } = useOnboarding();
  const [choice, setChoice] = useState<Choice>(() => {
    if (state.lastGamblingDateIsApproximate && !state.lastGamblingDate) {
      return "unsure";
    }
    if (state.lastGamblingDate === todayISODate()) return "today";
    if (state.lastGamblingDate === yesterdayISODate()) return "yesterday";
    if (state.lastGamblingDate) return "choose";
    return null;
  });
  const [customDate, setCustomDate] = useState(state.lastGamblingDate ?? "");
  const [touched, setTouched] = useState(false);

  const maxDate = todayISODate();
  const dateError =
    choice === "choose" &&
    touched &&
    (!customDate || isFutureISODate(customDate));

  const canContinue =
    choice === "today" ||
    choice === "yesterday" ||
    choice === "unsure" ||
    (choice === "choose" && Boolean(customDate) && !isFutureISODate(customDate));

  function continueNext() {
    setTouched(true);
    if (!canContinue || !choice) return;

    if (choice === "today") {
      update({
        lastGamblingDate: todayISODate(),
        lastGamblingDateIsApproximate: false,
      });
    } else if (choice === "yesterday") {
      update({
        lastGamblingDate: yesterdayISODate(),
        lastGamblingDateIsApproximate: false,
      });
    } else if (choice === "choose") {
      update({
        lastGamblingDate: customDate,
        lastGamblingDateIsApproximate: false,
      });
    } else {
      update({
        lastGamblingDate: null,
        lastGamblingDateIsApproximate: true,
      });
    }

    setStep(4);
    trackEvent("onboarding_date_completed", { step: "last-gamble" });
    router.push("/onboarding/confirm-date");
  }

  return (
    <OnboardingShell
      step={3}
      backHref="/onboarding/time"
      title="When did you last gamble?"
      description="We’ll use this date to track your gambling-free journey."
      footer={
        <Button
          size="lg"
          className="w-full justify-center"
          showArrow={false}
          disabled={!canContinue}
          onClick={continueNext}
        >
          Continue
        </Button>
      }
    >
      <div className="space-y-3">
        <OptionButton
          selected={choice === "today"}
          onClick={() => {
            setChoice("today");
            setTouched(true);
          }}
        >
          Today
        </OptionButton>
        <OptionButton
          selected={choice === "yesterday"}
          onClick={() => {
            setChoice("yesterday");
            setTouched(true);
          }}
        >
          Yesterday
        </OptionButton>
        <OptionButton
          selected={choice === "choose"}
          onClick={() => {
            setChoice("choose");
            setTouched(true);
          }}
        >
          Choose a date
        </OptionButton>
        <OptionButton
          selected={choice === "unsure"}
          onClick={() => {
            setChoice("unsure");
            setTouched(true);
          }}
        >
          I’m not sure
        </OptionButton>

        {choice === "choose" ? (
          <div className="pt-2">
            <label className="sr-only" htmlFor="last-gamble-date">
              Last gambling date
            </label>
            <input
              id="last-gamble-date"
              type="date"
              max={maxDate}
              value={customDate}
              onChange={(event) => {
                setCustomDate(event.target.value);
                setTouched(true);
              }}
              className={cn(
                "h-14 w-full rounded-[18px] border bg-card px-4 text-[15px] text-foreground",
                dateError ? "border-accent" : "border-border",
              )}
              aria-invalid={Boolean(dateError)}
              aria-describedby={dateError ? "date-error" : undefined}
            />
            {dateError ? (
              <p id="date-error" className="mt-2 text-sm text-accent" role="alert">
                Choose a date that is today or earlier.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </OnboardingShell>
  );
}
