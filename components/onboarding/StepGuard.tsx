"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { canAccessStep } from "@/lib/onboarding/storage";
import { ONBOARDING_STEPS } from "@/lib/onboarding/types";

export function StepGuard({
  step,
  children,
}: {
  step: number;
  children: ReactNode;
}) {
  const { state, hydrated } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (canAccessStep(state, step)) return;

    const fallback =
      ONBOARDING_STEPS.find((item) => canAccessStep(state, item.step))?.path ??
      "/onboarding/spend";
    router.replace(fallback);
  }, [hydrated, router, state, step]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!canAccessStep(state, step)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  return <>{children}</>;
}
