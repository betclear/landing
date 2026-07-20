export type ImpactEstimates = {
  annualGamblingSpend: number;
  annualGamblingHours: number;
  annualFullDays: number;
  displaySpend: number;
  displayHours: number;
  displayDays: number;
  displayDaysLabel: string;
};

export function calculateImpactEstimates(
  monthlyGamblingSpend: number,
  weeklyGamblingHours: number,
): ImpactEstimates {
  const annualGamblingSpend = monthlyGamblingSpend * 12;
  const annualGamblingHours = weeklyGamblingHours * 52;
  const annualFullDays = annualGamblingHours / 24;

  const displaySpend = Math.round(annualGamblingSpend);
  const displayHours = Math.round(annualGamblingHours);
  const displayDays =
    annualFullDays < 10
      ? Math.round(annualFullDays * 10) / 10
      : Math.round(annualFullDays);

  const displayDaysLabel =
    annualFullDays < 10
      ? displayDays.toFixed(1)
      : String(displayDays);

  return {
    annualGamblingSpend,
    annualGamblingHours,
    annualFullDays,
    displaySpend,
    displayHours,
    displayDays,
    displayDaysLabel,
  };
}

export const WEEKLY_HOUR_PRESETS = {
  less_than_2: 1,
  "2_to_5": 3.5,
  "6_to_10": 8,
  "10_plus": 12,
} as const;

export type WeeklyHourPresetId = keyof typeof WEEKLY_HOUR_PRESETS;
