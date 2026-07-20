import { Suspense } from "react";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { AuthStep } from "@/components/onboarding/AuthStep";

export default function AuthPage() {
  return (
    <OnboardingProvider>
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
            Loading…
          </div>
        }
      >
        <AuthStep />
      </Suspense>
    </OnboardingProvider>
  );
}
