"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
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
  const { state, hydrated, clear } = useOnboarding();
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
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
      setError("Sign-in didn’t finish. Please try again.");
    }
  }, [searchParams]);

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
        return "Your session expired. Please sign in again.";
      case "invalid_payload":
        return "Some onboarding answers were missing. Go back to pricing and try again.";
      case "save_failed":
        return "We couldn't save your progress. Please try again in a moment.";
      case "profile_required":
        return "We couldn't find your saved answers. Go back to pricing and try again.";
      case "invalid_plan":
        return "Please choose a plan on the previous step.";
      case "checkout_url_missing":
      case "checkout_failed":
        return "Checkout couldn't be started. Please try again.";
      default:
        return code
          ? `Something went wrong (${code}). Please try again.`
          : "We couldn't start checkout. Please check your connection and try again.";
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
        body: JSON.stringify({ plan: state.selectedPlan }),
      });

      const data = (await checkout.json()) as { url?: string; error?: string };
      if (!checkout.ok || !data.url) {
        throw new Error(data.error ?? "checkout_failed");
      }

      clear();
      window.location.href = data.url;
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
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/auth`,
        },
      });
      if (oauthError) throw oauthError;
    } catch {
      setBusy(false);
      setError("Google sign-in isn’t available right now. Try email instead.");
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
        const signUp = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth`,
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
        setInfo(
          "Check your email to confirm your account, then return here to continue.",
        );
        return;
      }

      await continueToCheckout();
    } catch {
      setBusy(false);
      setError("We couldn’t sign you in with that email. Please try again.");
    }
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <OnboardingShell
      step={6}
      backHref="/onboarding/pricing"
      title="Save your progress"
      description="Create your private Betclear account to continue with your selected plan."
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
            Continue with Google
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full justify-center"
            showArrow={false}
            disabled={busy}
            onClick={() => setMode("email")}
          >
            Continue with email
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="w-full justify-center opacity-60"
            showArrow={false}
            disabled
            aria-disabled="true"
          >
            Continue with Apple (soon)
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={continueWithEmail}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-muted-foreground"
            >
              Email
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
              Password
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
            {busy ? "Continuing…" : "Continue"}
          </Button>
          <button
            type="button"
            className="w-full text-sm text-muted-foreground underline underline-offset-2"
            onClick={() => setMode("choose")}
            disabled={busy}
          >
            Other sign-in options
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
          Preparing your secure checkout…
        </p>
      ) : null}
    </OnboardingShell>
  );
}
