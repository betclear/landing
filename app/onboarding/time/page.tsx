import { StepGuard } from "@/components/onboarding/StepGuard";
import { TimeStep } from "@/components/onboarding/TimeStep";

export default function OnboardingTimePage() {
  return (
    <StepGuard step={2}>
      <TimeStep />
    </StepGuard>
  );
}
