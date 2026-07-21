"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import {
  canAccessStep,
  isSpendValid,
  isTimeValid,
} from "@/lib/onboarding/storage";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/cn";

type Mode = "choose" | "email";

export function AuthStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, href, t } = useLocale();
  const { state, hydrated } = useOnboarding();
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!canAccessStep(state, 6) || !isSpendValid(state.monthlyGamblingSpend) || !isTimeValid(state.weeklyGamblingHours)) {
      router.replace(href("/onboarding/spend"));
    }
  }, [hydrated, href, router, state]);

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
    setBusy(true);
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
        body: JSON.stringify({ plan: state.selectedPlan, locale }),
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
      setBusy(false);
      const code =
        cause instanceof Error ? cause.message : "checkout_failed";
      setError(messageForApiError(code));
    }
  }

  async function continueWithGoogle() {
    setBusy(true);
    setError(null);
    trackEvent("authentication_started", { method: "google", step: "auth" });

    try {
      const supabase = createBrowserSupabaseClient();
      const origin = window.location.origin;
      const next = href("/auth");
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (oauthError) throw oauthError;
    } catch {
      setBusy(false);
      setError(t("onboarding.auth.errors.googleUnavailable"));
    }
  }

  async function continueWithEmail(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
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
        const next = href("/auth");
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
          await continueToCheckout();
          return;
        }

        setBusy(false);
        setInfo(t("onboarding.auth.checkEmailConfirm"));
        return;
      }

      await continueToCheckout();
    } catch {
      setBusy(false);
      setError(t("onboarding.auth.errors.emailSignInFailed"));
    }
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <OnboardingShell
      step={6}
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
            {t("onboarding.auth.continueWithGoogle")}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full justify-center"
            showArrow={false}
            disabled={busy}
            onClick={() => setMode("email")}
          >
            {t("onboarding.auth.continueWithEmail")}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="w-full justify-center opacity-60"
            showArrow={false}
            disabled
            aria-disabled="true"
          >
            {t("onboarding.auth.continueWithAppleSoon")}
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
          >
            {busy ? t("common.continuing") : t("common.continue")}
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
      {busy && !error ? (
        <p className="mt-4 text-sm text-muted-foreground" role="status">
          {t("onboarding.auth.preparingCheckout")}
        </p>
      ) : null}
    </OnboardingShell>
  );
}
