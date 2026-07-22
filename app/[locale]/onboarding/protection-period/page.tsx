import { StepGuard } from "@/components/onboarding/StepGuard";
import { ProtectionPeriodStep } from "@/components/onboarding/ProtectionPeriodStep";

export default function OnboardingProtectionPeriodPage() {
  return (
    <StepGuard step={6}>
      <ProtectionPeriodStep />
    </StepGuard>
  );
}
