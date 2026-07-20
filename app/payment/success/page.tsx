import { Suspense } from "react";
import { PaymentSuccess } from "@/components/onboarding/PaymentSuccess";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
          Confirming your subscription…
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}
