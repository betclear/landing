"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearOnboardingState,
  createDefaultOnboardingState,
  loadOnboardingState,
  saveOnboardingState,
} from "@/lib/onboarding/storage";
import type { OnboardingState, PlanId } from "@/lib/onboarding/types";

type OnboardingContextValue = {
  state: OnboardingState;
  hydrated: boolean;
  update: (patch: Partial<OnboardingState>) => void;
  setStep: (step: number) => void;
  setPlan: (plan: PlanId) => void;
  clear: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({
  children,
  defaultCurrency,
}: {
  children: ReactNode;
  defaultCurrency?: string;
}) {
  const [state, setState] = useState<OnboardingState>(() =>
    createDefaultOnboardingState(defaultCurrency),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadOnboardingState(defaultCurrency));
    setHydrated(true);
  }, [defaultCurrency]);

  useEffect(() => {
    if (!hydrated) return;
    saveOnboardingState(state);
  }, [state, hydrated]);

  const value: OnboardingContextValue = {
    state,
    hydrated,
    update: (patch) => setState((prev) => ({ ...prev, ...patch })),
    setStep: (step) =>
      setState((prev) => ({
        ...prev,
        currentStep: Math.max(prev.currentStep, step),
      })),
    setPlan: (plan) => setState((prev) => ({ ...prev, selectedPlan: plan })),
    clear: () => {
      clearOnboardingState();
      setState(createDefaultOnboardingState(defaultCurrency));
    },
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
