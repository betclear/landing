import { StepGuard } from "@/components/onboarding/StepGuard";
import { ImpactStep } from "@/components/onboarding/ImpactStep";

export default function OnboardingImpactPage() {
  return (
    <StepGuard step={5}>
      <ImpactStep />
    </StepGuard>
  );
}
