"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authCallbackUrl } from "@/lib/auth/redirect";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type SignInFormProps = {
  nextPath: string;
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
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

export function SignInForm({ nextPath }: SignInFormProps) {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error") === "auth";
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(
    authError ? "Sign-in failed or expired. Try again." : null,
  );
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const busy = emailLoading || googleLoading;

  async function signInWithGoogle() {
    setGoogleLoading(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: authCallbackUrl(nextPath),
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (oauthError) {
      setError(
        oauthError instanceof Error
          ? oauthError.message
          : "Unable to start Google sign-in",
      );
      setGoogleLoading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setEmailLoading(true);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: authCallbackUrl(nextPath),
        },
      });

      if (signInError) {
        throw signInError;
      }

      setSent(true);
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Unable to send sign-in link",
      );
    } finally {
      setEmailLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-[var(--radius-xl)] border border-border bg-surface p-6">
        <p className="text-sm font-medium text-foreground">Check your email</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We sent a sign-in link to{" "}
          <span className="font-medium text-foreground">{email}</span>. Open it
          on this device to continue to checkout or install your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        showArrow={false}
        disabled={busy}
        onClick={signInWithGoogle}
      >
        <span className="inline-flex items-center justify-center gap-3">
          <GoogleIcon />
          <span>
            {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
          </span>
        </span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <p className="relative mx-auto w-fit bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
          or use email
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-card px-3 text-sm text-foreground outline-none ring-ring transition focus:ring-2"
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          showArrow={false}
          disabled={busy}
        >
          {emailLoading ? "Sending link..." : "Email me a sign-in link"}
        </Button>
      </form>
    </div>
  );
}
