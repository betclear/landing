"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OptionButton } from "@/components/onboarding/OptionButton";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import {
  WEEKLY_HOUR_PRESETS,
  type WeeklyHourPresetId,
} from "@/lib/onboarding/calculations";
import { isTimeValid } from "@/lib/onboarding/storage";
import { cn } from "@/lib/cn";

const OPTION_IDS: (WeeklyHourPresetId | "manual")[] = [
  "less_than_2",
  "2_to_5",
  "6_to_10",
  "10_plus",
  "manual",
];

const OPTION_KEYS = {
  less_than_2: "lessThan2",
  "2_to_5": "twoToFive",
  "6_to_10": "sixToTen",
  "10_plus": "tenPlus",
  manual: "manual",
} as const;

function matchPreset(hours: number | null): WeeklyHourPresetId | "manual" | null {
  if (hours == null) return null;
  const entry = (
    Object.entries(WEEKLY_HOUR_PRESETS) as [WeeklyHourPresetId, number][]
  ).find(([, value]) => value === hours);
  return entry ? entry[0] : "manual";
}

export function TimeStep() {
  const router = useRouter();
  const { href, t } = useLocale();
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
    router.push(href("/onboarding/last-gamble"));
  }

  return (
    <OnboardingShell
      step={2}
      backHref="/onboarding/spend"
      title={t("onboarding.time.title")}
      description={t("onboarding.time.description")}
      footer={
        <Button
          size="lg"
          className="w-full justify-center"
          showArrow={false}
          disabled={!valid}
          onClick={continueNext}
        >
          {t("onboarding.time.continue")}
        </Button>
      }
    >
      <div className="space-y-3">
        {OPTION_IDS.map((id) => (
          <OptionButton
            key={id}
            selected={selected === id}
            onClick={() => {
              setSelected(id);
              setTouched(true);
              if (id !== "manual") {
                update({
                  weeklyGamblingHours: WEEKLY_HOUR_PRESETS[id],
                });
              }
            }}
          >
            {t(`onboarding.time.options.${OPTION_KEYS[id]}`)}
          </OptionButton>
        ))}

        {selected === "manual" ? (
          <div className="pt-2">
            <label className="sr-only" htmlFor="weekly-hours">
              {t("onboarding.time.hoursLabel")}
            </label>
            <input
              id="weekly-hours"
              type="text"
              inputMode="decimal"
              placeholder={t("onboarding.time.manualPlaceholder")}
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
                {t("onboarding.time.error")}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </OnboardingShell>
  );
}
