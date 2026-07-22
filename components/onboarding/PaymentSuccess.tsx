"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { clearOnboardingState } from "@/lib/onboarding/storage";
import { SITE } from "@/lib/constants";
import { Link } from "@/lib/i18n/navigation";

type Status = "loading" | "error";

export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { t } = useLocale();
  const router = useRouter();
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

        const successRes = await fetch("/api/checkout/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        let installPath = "/install";
        if (successRes.ok) {
          const successData = (await successRes.json()) as { token?: string };
          if (successData.token) {
            installPath = `${installPath}?access=${encodeURIComponent(successData.token)}`;
          }
        }

        if (!cancelled) {
          clearOnboardingState();
          trackEvent("stripe_checkout_completed", { step: "payment-success" });
          router.replace(installPath);
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, retryToken, router]);

  if (status === "loading") {
    return (
      <div
        className="flex min-h-dvh items-center justify-center bg-background"
        role="status"
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-primary"
          aria-hidden="true"
        />
        <span className="sr-only">{t("common.loading")}</span>
      </div>
    );
  }

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
            href={"/"}
            className="inline-flex items-center transition-opacity hover:opacity-80"
            aria-label={SITE.name}
          >
            <BrandLogo height={22} />
          </Link>
        </Container>
      </header>

      <main className="relative z-10 flex flex-1 items-center">
        <Container className="max-w-lg py-16">
          <div>
            <h1 className="text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem]">
              {t("paymentSuccess.errorTitle")}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              {t("paymentSuccess.error")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                showArrow={false}
                onClick={() => setRetryToken((value) => value + 1)}
              >
                {t("paymentSuccess.tryAgain")}
              </Button>
              <Button
                href={"/onboarding/pricing"}
                variant="secondary"
                size="lg"
                showArrow={false}
              >
                {t("paymentSuccess.backToPlans")}
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
