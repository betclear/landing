"use client";

import { useEffect } from "react";
import { SpendStep } from "@/components/onboarding/SpendStep";
import { trackEvent } from "@/lib/analytics";

export default function OnboardingSpendPage() {
  useEffect(() => {
    trackEvent("onboarding_started", { step: "spend" });
  }, []);

  return <SpendStep />;
}
