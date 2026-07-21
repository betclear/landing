"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
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
  const { href, t } = useLocale();

  useEffect(() => {
    if (!hydrated) return;
    if (canAccessStep(state, step)) return;

    const fallbackPath =
      ONBOARDING_STEPS.find((item) => canAccessStep(state, item.step))?.path ??
      "/onboarding/spend";
    router.replace(href(fallbackPath));
  }, [hydrated, href, router, state, step]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  if (!canAccessStep(state, step)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  return <>{children}</>;
}
