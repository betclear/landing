"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
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
  const { href, t } = useLocale();
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
    router.push(href("/onboarding/time"));
  }

  return (
    <OnboardingShell
      step={1}
      title={t("onboarding.spend.title")}
      description={t("onboarding.spend.description")}
      footer={
        <Button
          size="lg"
          className="w-full justify-center"
          showArrow={false}
          disabled={!valid}
          onClick={continueNext}
        >
          {t("onboarding.spend.continue")}
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-[8.5rem_1fr] gap-3">
          <label className="sr-only" htmlFor="currency">
            {t("onboarding.spend.currencyLabel")}
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
                {t(`onboarding.spend.currencyOptions.${option.code}`)}
              </option>
            ))}
          </select>

          <div>
            <label className="sr-only" htmlFor="monthly-spend">
              {t("onboarding.spend.amountLabel")}
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
          {t("onboarding.spend.amountPerMonth")}
        </p>

        {showError ? (
          <p id="spend-error" className="text-sm text-accent" role="alert">
            {t("onboarding.spend.error")}
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
            {t("common.custom")}
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}
