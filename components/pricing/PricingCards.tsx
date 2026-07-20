"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { PlanConfig } from "@/lib/stripe/config";

type PricingCardsProps = {
  plans: PlanConfig[];
};

export function PricingCards({ plans }: PricingCardsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(planId: PlanConfig["id"]) {
    setLoadingPlan(planId);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
        loginUrl?: string;
      };

      if (response.status === 401 && data.loginUrl) {
        window.location.href = data.loginUrl;
        return;
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout",
      );
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      {error ? (
        <p className="mb-6 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`relative flex flex-col rounded-[var(--radius-2xl)] border p-8 text-left shadow-soft ${
              plan.highlighted
                ? "border-primary bg-card ring-1 ring-primary/20"
                : "border-border bg-card"
            }`}
          >
            {plan.highlighted ? (
              <p className="mb-4 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Best value
              </p>
            ) : null}

            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
              {plan.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {plan.description}
            </p>

            <div className="mt-6 flex items-end gap-2">
              <p className="text-4xl font-semibold tracking-[-0.04em] text-foreground">
                {plan.priceLabel}
              </p>
              <p className="pb-1 text-sm text-muted-foreground">
                {plan.intervalLabel}
              </p>
            </div>

            <ul className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button
                variant={plan.highlighted ? "primary" : "secondary"}
                size="lg"
                className="w-full"
                showArrow={false}
                disabled={loadingPlan !== null}
                onClick={() => startCheckout(plan.id)}
              >
                {loadingPlan === plan.id ? "Redirecting..." : "Get Protected"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
