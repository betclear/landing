"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { trackEvent } from "@/lib/analytics";
import { SITE } from "@/lib/constants";
import Link from "next/link";

type Status = "loading" | "ready" | "error";

export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("loading");
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      setStatus("loading");
      if (!sessionId) {
        if (!cancelled) setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          `/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!response.ok) {
          throw new Error("verify_failed");
        }

        // Grant Safari-compatible access cookie used by the profile paywall.
        await fetch("/api/checkout/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!cancelled) {
          setStatus("ready");
          trackEvent("stripe_checkout_completed", { step: "payment-success" });
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, retryToken]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-18%] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_68%)]" />
        <div className="absolute inset-0 marketing-grain opacity-20" />
      </div>

      <header className="relative z-10 border-b border-border/60">
        <Container className="flex h-14 items-center">
          <Link
            href="/"
            className="text-sm font-semibold tracking-[-0.02em] text-foreground"
          >
            {SITE.name}
          </Link>
        </Container>
      </header>

      <main className="relative z-10 flex flex-1 items-center">
        <Container className="max-w-lg py-16">
          {status === "loading" ? (
            <div role="status">
              <h1 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem]">
                Confirming your subscription…
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                This usually takes just a moment.
              </p>
            </div>
          ) : null}

          {status === "ready" ? (
            <div>
              <h1 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem]">
                Your Betclear account is ready
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Complete the final installation step to activate gambling
                blocking on this device.
              </p>
              <div className="mt-8">
                <Button href="/install" size="lg" showArrow={false}>
                  Install protection
                </Button>
              </div>
            </div>
          ) : null}

          {status === "error" ? (
            <div>
              <h1 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem]">
                We couldn’t confirm your subscription yet
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Please try again. If you were charged, your access will activate
                shortly.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  showArrow={false}
                  onClick={() => setRetryToken((value) => value + 1)}
                >
                  Try again
                </Button>
                <Button
                  href="/onboarding/pricing"
                  variant="secondary"
                  size="lg"
                  showArrow={false}
                >
                  Back to plans
                </Button>
              </div>
            </div>
          ) : null}
        </Container>
      </main>
    </div>
  );
}
