"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { trackEvent } from "@/lib/analytics";
import {
  CURRENCY_OPTIONS,
  QUICK_AMOUNTS,
  currencySymbol,
  isSupportedCurrency,
} from "@/lib/onboarding/currency";
import { isSpendValid } from "@/lib/onboarding/storage";
import { cn } from "@/lib/cn";

export function SpendStep() {
  const router = useRouter();
  const { state, update, setStep } = useOnboarding();
  const currency = isSupportedCurrency(state.currency) ? state.currency : "USD";
  const [amountText, setAmountText] = useState(
    state.monthlyGamblingSpend != null
      ? String(state.monthlyGamblingSpend)
      : "",
  );
  const [touched, setTouched] = useState(false);
  const [customMode, setCustomMode] = useState(
    state.monthlyGamblingSpend != null &&
      !(QUICK_AMOUNTS as readonly number[]).includes(state.monthlyGamblingSpend),
  );

  const amount = useMemo(() => {
    if (!amountText.trim()) return null;
    const parsed = Number(amountText.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }, [amountText]);

  const valid = isSpendValid(amount);
  const showError = touched && !valid;
  const symbol = currencySymbol(currency);
  const symbolPad = symbol.length > 1 ? "pl-12" : "pl-10";

  function selectQuick(value: number | "custom") {
    if (value === "custom") {
      setCustomMode(true);
      setAmountText("");
      update({ monthlyGamblingSpend: null });
      return;
    }
    setCustomMode(false);
    setAmountText(String(value));
    setTouched(true);
    update({ monthlyGamblingSpend: value });
  }

  function continueNext() {
    setTouched(true);
    if (!valid || amount == null) return;
    update({
      monthlyGamblingSpend: amount,
      currency,
    });
    setStep(2);
    trackEvent("onboarding_spend_completed", {
      currency,
      step: "spend",
    });
    router.push("/onboarding/time");
  }

  return (
    <OnboardingShell
      step={1}
      title="How much do you usually spend gambling per month?"
      description="Enter a typical monthly amount. We’ll use it to estimate how much money you may save over time."
      footer={
        <Button
          size="lg"
          className="w-full justify-center"
          showArrow={false}
          disabled={!valid}
          onClick={continueNext}
        >
          Continue
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-[8.5rem_1fr] gap-3">
          <label className="sr-only" htmlFor="currency">
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(event) => {
              const next = event.target.value.toUpperCase();
              update({
                currency: isSupportedCurrency(next) ? next : "USD",
              });
            }}
            className="h-14 rounded-[18px] border border-border bg-card px-3 text-[15px] text-foreground"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code}
              </option>
            ))}
          </select>

          <div>
            <label className="sr-only" htmlFor="monthly-spend">
              Monthly gambling spend
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {symbol}
              </span>
              <input
                id="monthly-spend"
                inputMode="decimal"
                type="text"
                placeholder="500"
                value={amountText}
                onChange={(event) => {
                  setCustomMode(true);
                  setAmountText(event.target.value);
                  setTouched(true);
                }}
                onBlur={() => setTouched(true)}
                className={cn(
                  "h-14 w-full rounded-[18px] border bg-card pr-4 text-[15px] text-foreground placeholder:text-muted-foreground/70",
                  symbolPad,
                  showError ? "border-accent" : "border-border",
                )}
                aria-invalid={showError}
                aria-describedby="spend-period spend-error"
              />
            </div>
          </div>
        </div>

        <p id="spend-period" className="text-sm text-muted-foreground">
          Amount per month
        </p>

        {showError ? (
          <p id="spend-error" className="text-sm text-accent" role="alert">
            Enter a monthly amount greater than zero.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((value) => {
            const selected = !customMode && amount === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => selectQuick(value)}
                className={cn(
                  "min-h-11 rounded-full px-4 text-sm font-medium ring-1 transition-colors",
                  selected
                    ? "bg-primary/15 text-foreground ring-primary"
                    : "bg-card text-muted-foreground ring-border hover:text-foreground",
                )}
              >
                {value.toLocaleString()}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => selectQuick("custom")}
            className={cn(
              "min-h-11 rounded-full px-4 text-sm font-medium ring-1 transition-colors",
              customMode
                ? "bg-primary/15 text-foreground ring-primary"
                : "bg-card text-muted-foreground ring-border hover:text-foreground",
            )}
          >
            Custom
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}
