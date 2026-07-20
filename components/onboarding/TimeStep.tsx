"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OptionButton } from "@/components/onboarding/OptionButton";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { trackEvent } from "@/lib/analytics";
import {
  WEEKLY_HOUR_PRESETS,
  type WeeklyHourPresetId,
} from "@/lib/onboarding/calculations";
import { isTimeValid } from "@/lib/onboarding/storage";
import { cn } from "@/lib/cn";

const OPTIONS: { id: WeeklyHourPresetId | "manual"; label: string }[] = [
  { id: "less_than_2", label: "Less than 2 hours / week" },
  { id: "2_to_5", label: "2–5 hours / week" },
  { id: "6_to_10", label: "6–10 hours / week" },
  { id: "10_plus", label: "10+ hours / week" },
  { id: "manual", label: "Enter hours per week" },
];

function matchPreset(hours: number | null): WeeklyHourPresetId | "manual" | null {
  if (hours == null) return null;
  const entry = (
    Object.entries(WEEKLY_HOUR_PRESETS) as [WeeklyHourPresetId, number][]
  ).find(([, value]) => value === hours);
  return entry ? entry[0] : "manual";
}

export function TimeStep() {
  const router = useRouter();
  const { state, update, setStep } = useOnboarding();
  const initialPreset = matchPreset(state.weeklyGamblingHours);
  const [selected, setSelected] = useState<WeeklyHourPresetId | "manual" | null>(
    initialPreset,
  );
  const [manualText, setManualText] = useState(
    initialPreset === "manual" && state.weeklyGamblingHours != null
      ? String(state.weeklyGamblingHours)
      : "",
  );
  const [touched, setTouched] = useState(false);

  const hours = useMemo(() => {
    if (selected && selected !== "manual") {
      return WEEKLY_HOUR_PRESETS[selected];
    }
    if (selected === "manual") {
      if (!manualText.trim()) return null;
      const parsed = Number(manualText.replace(/,/g, ""));
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }, [manualText, selected]);

  const valid = isTimeValid(hours);
  const showError = touched && selected === "manual" && !valid;

  function continueNext() {
    setTouched(true);
    if (!valid || hours == null) return;
    update({ weeklyGamblingHours: hours });
    setStep(3);
    trackEvent("onboarding_time_completed", { step: "time" });
    router.push("/onboarding/last-gamble");
  }

  return (
    <OnboardingShell
      step={2}
      backHref="/onboarding/spend"
      title="How much time do you spend gambling per week?"
      description="Include time spent placing bets, checking results, researching odds, or thinking about gambling in a typical week."
      footer={
        <Button
          size="lg"
          className="w-full justify-center"
          showArrow={false}
          disabled={!valid}
          onClick={continueNext}
        >
          Continue
        </Button>
      }
    >
      <div className="space-y-3">
        {OPTIONS.map((option) => (
          <OptionButton
            key={option.id}
            selected={selected === option.id}
            onClick={() => {
              setSelected(option.id);
              setTouched(true);
              if (option.id !== "manual") {
                update({
                  weeklyGamblingHours: WEEKLY_HOUR_PRESETS[option.id],
                });
              }
            }}
          >
            {option.label}
          </OptionButton>
        ))}

        {selected === "manual" ? (
          <div className="pt-2">
            <label className="sr-only" htmlFor="weekly-hours">
              Hours per week
            </label>
            <input
              id="weekly-hours"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 4"
              value={manualText}
              onChange={(event) => {
                setManualText(event.target.value);
                setTouched(true);
              }}
              className={cn(
                "h-14 w-full rounded-[18px] border bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70",
                showError ? "border-accent" : "border-border",
              )}
              aria-invalid={showError}
              aria-describedby={showError ? "time-error" : undefined}
            />
            {showError ? (
              <p id="time-error" className="mt-2 text-sm text-accent" role="alert">
                Enter a number of hours greater than zero.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </OnboardingShell>
  );
}
