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

const OPTION_IDS: WeeklyHourPresetId[] = [
  "less_than_2",
  "2_to_5",
  "6_to_10",
  "10_plus",
];

const OPTION_KEYS = {
  less_than_2: "lessThan2",
  "2_to_5": "twoToFive",
  "6_to_10": "sixToTen",
  "10_plus": "tenPlus",
} as const;

function matchPreset(hours: number | null): WeeklyHourPresetId | null {
  if (hours == null) return null;
  const entry = (
    Object.entries(WEEKLY_HOUR_PRESETS) as [WeeklyHourPresetId, number][]
  ).find(([, value]) => value === hours);
  return entry ? entry[0] : null;
}

export function TimeStep() {
  const router = useRouter();
  const { href, t } = useLocale();
  const { state, update, setStep } = useOnboarding();
  const [selected, setSelected] = useState<WeeklyHourPresetId | null>(
    matchPreset(state.weeklyGamblingHours),
  );
  const [touched, setTouched] = useState(false);

  const hours = useMemo(() => {
    if (!selected) return null;
    return WEEKLY_HOUR_PRESETS[selected];
  }, [selected]);

  const valid = isTimeValid(hours);
  const showError = touched && !valid;

  function continueNext() {
    setTouched(true);
    if (!valid || hours == null || !selected) return;
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
              setTouched(false);
              update({
                weeklyGamblingHours: WEEKLY_HOUR_PRESETS[id],
              });
            }}
          >
            {t(`onboarding.time.options.${OPTION_KEYS[id]}`)}
          </OptionButton>
        ))}

        {showError ? (
          <p id="time-error" className="text-sm text-accent" role="alert">
            {t("onboarding.time.error")}
          </p>
        ) : null}
      </div>
    </OnboardingShell>
  );
}
