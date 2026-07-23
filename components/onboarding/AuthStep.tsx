"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { AppleLogo, EnvelopeSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { getClickAttribution } from "@/lib/attribution/client";
import { reportSignupAttribution } from "@/lib/attribution/report-signup-client";
import {
  canAccessStep,
  isSpendValid,
  isTimeValid,
} from "@/lib/onboarding/storage";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/cn";

type Mode = "choose" | "email";
type LoadingAction = "google" | "email" | "checkout" | null;

function ActivityIndicator({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-current/25 border-t-current",
          className ?? "h-5 w-5",
        )}
        aria-hidden="true"
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AuthButtonContent({
  icon,
  label,
  loading,
}: {
  icon: ReactNode;
  label: string;
  loading?: boolean;
}) {
  return (
    <span className="inline-flex items-center justify-center gap-3">
      {loading ? <ActivityIndicator /> : icon}
      <span>{label}</span>
    </span>
  );
}

export function AuthStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, t } = useLocale();
  const { state, hydrated } = useOnboarding();
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const busy = loadingAction !== null;
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!canAccessStep(state, 6) || !isSpendValid(state.monthlyGamblingSpend) || !isTimeValid(state.weeklyGamblingHours)) {
      router.replace("/onboarding/spend");
    }
  }, [hydrated, router, state]);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      setError(t("onboarding.auth.errors.signInDidntFinish"));
    }
  }, [searchParams, t]);

  useEffect(() => {
    if (!hydrated) return;
    if (
      !canAccessStep(state, 6) ||
      !isSpendValid(state.monthlyGamblingSpend) ||
      !isTimeValid(state.weeklyGamblingHours)
    ) {
      return;
    }

    let cancelled = false;

    async function resumeIfAuthenticated() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        await continueToCheckout();
      } catch {
        // Stay on auth screen.
      }
    }

    void resumeIfAuthenticated();
    return () => {
      cancelled = true;
    };
    // Resume once after hydrate when onboarding answers are present.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  function messageForApiError(code: string | undefined): string {
    switch (code) {
      case "unauthorized":
        return t("onboarding.auth.errors.unauthorized");
      case "invalid_payload":
        return t("onboarding.auth.errors.invalidPayload");
      case "save_failed":
        return t("onboarding.auth.errors.saveFailed");
      case "profile_required":
        return t("onboarding.auth.errors.profileRequired");
      case "invalid_plan":
        return t("onboarding.auth.errors.invalidPlan");
      case "checkout_url_missing":
      case "checkout_failed":
        return t("onboarding.auth.errors.checkoutFailed");
      default:
        return code
          ? t("onboarding.auth.errors.genericWithCode", { code })
          : t("onboarding.auth.errors.genericCheckout");
    }
  }

  async function persistProfile() {
    const payload = {
      currency: state.currency,
      monthlyGamblingSpend: state.monthlyGamblingSpend,
      weeklyGamblingHours: state.weeklyGamblingHours,
      lastGamblingDate: state.lastGamblingDate,
      lastGamblingDateIsApproximate: state.lastGamblingDateIsApproximate,
      selectedPlan: state.selectedPlan,
    };

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch("/api/onboarding/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) return;

      if (response.status === 401 && attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
        continue;
      }

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(data.error ?? "persist_failed");
    }
  }

  async function continueToCheckout() {
    setLoadingAction("checkout");
    setError(null);
    try {
      await persistProfile();
      trackEvent("authentication_completed", {
        plan: state.selectedPlan,
        step: "auth",
      });

      trackEvent("stripe_checkout_started", {
        plan: state.selectedPlan,
        step: "checkout",
      });

      const checkout = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: state.selectedPlan,
          locale,
          ...getClickAttribution(),
        }),
      });

      const data = (await checkout.json()) as { url?: string; error?: string };
      if (!checkout.ok || !data.url) {
        throw new Error(data.error ?? "checkout_failed");
      }

      // Keep onboarding answers in localStorage so cancelling Stripe returns
      // the user to a populated flow; they're cleared only after a verified
      // payment on /payment/success. Use replace() so the /auth step is taken
      // out of history — pressing back on Stripe returns to the packages step
      // instead of re-triggering the auth/checkout redirect.
      window.location.replace(data.url);
    } catch (cause) {
      setLoadingAction(null);
      const code =
        cause instanceof Error ? cause.message : "checkout_failed";
      setError(messageForApiError(code));
    }
  }

  async function continueWithGoogle() {
    setLoadingAction("google");
    setError(null);
    trackEvent("authentication_started", { method: "google", step: "auth" });

    try {
      const supabase = createBrowserSupabaseClient();
      const origin = window.location.origin;
      const next = "/auth";
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (oauthError) throw oauthError;
    } catch {
      setLoadingAction(null);
      setError(t("onboarding.auth.errors.googleUnavailable"));
    }
  }

  async function continueWithEmail(event: FormEvent) {
    event.preventDefault();
    setLoadingAction("email");
    setError(null);
    setInfo(null);
    trackEvent("authentication_started", { method: "email", step: "auth" });

    try {
      const supabase = createBrowserSupabaseClient();
      const signIn = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signIn.error) {
        const next = "/auth";
        const signUp = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });

        if (signUp.error) {
          throw signUp.error;
        }

        if (signUp.data.session) {
          reportSignupAttribution();
          await continueToCheckout();
          return;
        }

        setLoadingAction(null);
        setInfo(t("onboarding.auth.checkEmailConfirm"));
        return;
      }

      await continueToCheckout();
    } catch {
      setLoadingAction(null);
      setError(t("onboarding.auth.errors.emailSignInFailed"));
    }
  }

  if (!hydrated) {
    return (
      <div
        className="flex min-h-dvh items-center justify-center bg-background"
        role="status"
      >
        <ActivityIndicator
          className="h-8 w-8 border-muted-foreground/25 border-t-primary"
          label={t("common.loading")}
        />
      </div>
    );
  }

  return (
    <OnboardingShell
      step={7}
      backHref="/onboarding/pricing"
      title={t("onboarding.auth.title")}
      description={t("onboarding.auth.description")}
    >
      {mode === "choose" ? (
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full justify-center"
            showArrow={false}
            disabled={busy}
            onClick={continueWithGoogle}
          >
            <AuthButtonContent
              icon={<GoogleIcon />}
              label={t("onboarding.auth.continueWithGoogle")}
              loading={loadingAction === "google"}
            />
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full justify-center"
            showArrow={false}
            disabled={busy}
            onClick={() => setMode("email")}
          >
            <AuthButtonContent
              icon={
                <EnvelopeSimple
                  size={20}
                  weight="regular"
                  className="shrink-0"
                  aria-hidden="true"
                />
              }
              label={t("onboarding.auth.continueWithEmail")}
            />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="w-full justify-center opacity-60"
            showArrow={false}
            disabled
            aria-disabled="true"
          >
            <AuthButtonContent
              icon={
                <AppleLogo
                  size={20}
                  weight="fill"
                  className="shrink-0"
                  aria-hidden="true"
                />
              }
              label={t("onboarding.auth.continueWithAppleSoon")}
            />
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={continueWithEmail}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-muted-foreground"
            >
              {t("onboarding.auth.email")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-14 w-full rounded-[18px] border border-border bg-card px-4 text-[15px] text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-muted-foreground"
            >
              {t("onboarding.auth.password")}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-14 w-full rounded-[18px] border border-border bg-card px-4 text-[15px] text-foreground"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full justify-center"
            showArrow={false}
            disabled={busy}
            aria-busy={loadingAction === "email" || loadingAction === "checkout"}
          >
            {loadingAction === "email" || loadingAction === "checkout" ? (
              <ActivityIndicator label={t("common.continuing")} />
            ) : (
              t("common.continue")
            )}
          </Button>
          <button
            type="button"
            className="w-full text-sm text-muted-foreground underline underline-offset-2"
            onClick={() => setMode("choose")}
            disabled={busy}
          >
            {t("onboarding.auth.otherOptions")}
          </button>
        </form>
      )}

      {error ? (
        <p
          className={cn("mt-4 text-sm text-accent")}
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="mt-4 text-sm text-muted-foreground" role="status">
          {info}
        </p>
      ) : null}
      {loadingAction === "checkout" && mode === "choose" && !error ? (
        <div className="mt-4 flex justify-center" role="status">
          <ActivityIndicator
            className="h-6 w-6 border-muted-foreground/25 border-t-primary"
            label={t("onboarding.auth.preparingCheckout")}
          />
        </div>
      ) : null}
    </OnboardingShell>
  );
}
