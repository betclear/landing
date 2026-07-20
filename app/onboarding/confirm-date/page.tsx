import { StepGuard } from "@/components/onboarding/StepGuard";
import { ConfirmDateStep } from "@/components/onboarding/ConfirmDateStep";

export default function OnboardingConfirmDatePage() {
  return (
    <StepGuard step={4}>
      <ConfirmDateStep />
    </StepGuard>
  );
}
