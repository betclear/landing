import {
  inferCurrencyFromLocale,
  isSupportedCurrency,
} from "@/lib/onboarding/currency";
import {
  ONBOARDING_STORAGE_KEY,
  isProtectionDurationMonths,
  type OnboardingState,
  type PlanId,
  type ProtectionDurationMonths,
} from "@/lib/onboarding/types";

export function createDefaultOnboardingState(
  currency?: string,
): OnboardingState {
  return {
    currentStep: 1,
    currency: currency ?? "USD",
    monthlyGamblingSpend: null,
    weeklyGamblingHours: null,
    lastGamblingDate: null,
    lastGamblingDateIsApproximate: false,
    protectionDurationMonths: 12,
    selectedPlan: "annual",
  };
}

export function createClientDefaultOnboardingState(
  defaultCurrency?: string,
): OnboardingState {
  return createDefaultOnboardingState(
    defaultCurrency ?? inferCurrencyFromLocale(),
  );
}

function isPlanId(value: unknown): value is PlanId {
  return value === "annual" || value === "monthly";
}

export function parseOnboardingState(raw: unknown): OnboardingState | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<OnboardingState>;
  const normalizedCurrency =
    typeof data.currency === "string" &&
    isSupportedCurrency(data.currency.toUpperCase())
      ? data.currency.toUpperCase()
      : undefined;
  const base = createDefaultOnboardingState(normalizedCurrency);

  const protectionDurationMonths: ProtectionDurationMonths =
    isProtectionDurationMonths(data.protectionDurationMonths)
      ? data.protectionDurationMonths
      : base.protectionDurationMonths;

  return {
    currentStep:
      typeof data.currentStep === "number" && data.currentStep >= 1
        ? data.currentStep
        : base.currentStep,
    currency: base.currency,
    monthlyGamblingSpend:
      typeof data.monthlyGamblingSpend === "number" &&
      Number.isFinite(data.monthlyGamblingSpend)
        ? data.monthlyGamblingSpend
        : null,
    weeklyGamblingHours:
      typeof data.weeklyGamblingHours === "number" &&
      Number.isFinite(data.weeklyGamblingHours)
        ? data.weeklyGamblingHours
        : null,
    lastGamblingDate:
      typeof data.lastGamblingDate === "string" || data.lastGamblingDate === null
        ? (data.lastGamblingDate ?? null)
        : null,
    lastGamblingDateIsApproximate: Boolean(data.lastGamblingDateIsApproximate),
    protectionDurationMonths,
    selectedPlan: isPlanId(data.selectedPlan)
      ? data.selectedPlan
      : base.selectedPlan,
  };
}

export function loadOnboardingState(
  defaultCurrency?: string,
): OnboardingState {
  if (typeof window === "undefined") {
    return createDefaultOnboardingState(defaultCurrency);
  }

  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return createClientDefaultOnboardingState(defaultCurrency);
    const parsed = parseOnboardingState(JSON.parse(raw));
    return parsed ?? createClientDefaultOnboardingState(defaultCurrency);
  } catch {
    return createClientDefaultOnboardingState(defaultCurrency);
  }
}

export function saveOnboardingState(state: OnboardingState): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable; continue in-memory.
  }
}

export function clearOnboardingState(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

export function isSpendValid(amount: number | null): boolean {
  return typeof amount === "number" && Number.isFinite(amount) && amount > 0;
}

export function isTimeValid(hours: number | null): boolean {
  return typeof hours === "number" && Number.isFinite(hours) && hours > 0;
}

export function hasDateAnswer(state: OnboardingState): boolean {
  return state.lastGamblingDate !== null || state.lastGamblingDateIsApproximate;
}

export function canAccessStep(state: OnboardingState, step: number): boolean {
  if (step <= 1) return true;
  if (!isSpendValid(state.monthlyGamblingSpend)) return false;
  if (step === 2) return true;
  if (!isTimeValid(state.weeklyGamblingHours)) return false;
  if (step === 3) return true;
  if (!hasDateAnswer(state)) return false;
  if (step === 4) return true;
  if (step === 5) return state.currentStep >= 4;
  if (step === 6) return state.currentStep >= 5;
  if (step >= 7) return state.currentStep >= 6;
  return true;
}
