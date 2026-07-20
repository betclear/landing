"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { trackEvent } from "@/lib/analytics";
import { formatDisplayDate } from "@/lib/onboarding/dates";

export function ConfirmDateStep() {
  const router = useRouter();
  const { state, setStep } = useOnboarding();

  const exact = Boolean(state.lastGamblingDate) && !state.lastGamblingDateIsApproximate;
  const approximateWithDate =
    Boolean(state.lastGamblingDate) && state.lastGamblingDateIsApproximate;

  let bodyPrimary: string;
  let bodySecondary: string;

  if (exact && state.lastGamblingDate) {
    bodyPrimary = `You told us your last gambling date was ${formatDisplayDate(state.lastGamblingDate)}.`;
    bodySecondary =
      "Once your recovery tracker begins, this starting date cannot be moved forward. You’ll still be able to correct it if you entered it incorrectly.";
  } else if (approximateWithDate && state.lastGamblingDate) {
    bodyPrimary = `You told us your last gambling date was around ${formatDisplayDate(state.lastGamblingDate)}.`;
    bodySecondary =
      "We’ll treat this as an approximate starting point for your journey. You can refine it later if needed.";
  } else {
    bodyPrimary =
      "You’re not sure of your exact last gambling date, and that’s okay.";
    bodySecondary =
      "We’ll start your journey from today as an approximate beginning. You can update this later if you remember a clearer date.";
  }

  function confirm() {
    setStep(5);
    trackEvent("onboarding_date_confirmed", { step: "confirm-date" });
    router.push("/onboarding/impact");
  }

  return (
    <OnboardingShell
      step={4}
      backHref="/onboarding/last-gamble"
      title="Your journey starts here"
      footer={
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full justify-center"
            showArrow={false}
            onClick={confirm}
          >
            Confirm date
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full justify-center"
            showArrow={false}
            href="/onboarding/last-gamble"
          >
            Change date
          </Button>
        </div>
      }
    >
      <div className="space-y-4 rounded-[24px] bg-card/70 p-5 ring-1 ring-border">
        <p className="text-[15px] leading-relaxed text-foreground">
          {bodyPrimary}
        </p>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {bodySecondary}
        </p>
      </div>
    </OnboardingShell>
  );
}
