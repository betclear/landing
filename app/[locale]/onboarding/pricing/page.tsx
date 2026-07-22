import { StepGuard } from "@/components/onboarding/StepGuard";
import { PricingStep } from "@/components/onboarding/PricingStep";

export default function OnboardingPricingPage() {
  return (
    <StepGuard step={7}>
      <PricingStep />
    </StepGuard>
  );
}
