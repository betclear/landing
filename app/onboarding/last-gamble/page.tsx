import { StepGuard } from "@/components/onboarding/StepGuard";
import { LastGambleStep } from "@/components/onboarding/LastGambleStep";

export default function OnboardingLastGamblePage() {
  return (
    <StepGuard step={3}>
      <LastGambleStep />
    </StepGuard>
  );
}
