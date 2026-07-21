"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { formatLongDate } from "@/lib/i18n/format";

export function ConfirmDateStep() {
  const router = useRouter();
  const { locale, href, t } = useLocale();
  const { state, setStep } = useOnboarding();

  const hasDate = Boolean(state.lastGamblingDate);
  const exact =
    Boolean(state.lastGamblingDate) && !state.lastGamblingDateIsApproximate;
  const approximateWithDate =
    Boolean(state.lastGamblingDate) && state.lastGamblingDateIsApproximate;

  let bodyPrimary: string;
  let bodySecondary: string;

  if (exact && state.lastGamblingDate) {
    bodyPrimary = formatLongDate(state.lastGamblingDate, locale);
    bodySecondary = t("onboarding.confirmDate.description");
  } else if (approximateWithDate && state.lastGamblingDate) {
    bodyPrimary = t("onboarding.confirmDate.approxPrimary", {
      date: formatLongDate(state.lastGamblingDate, locale),
    });
    bodySecondary = t("onboarding.confirmDate.approxSecondary");
  } else {
    bodyPrimary = t("onboarding.confirmDate.unsurePrimary");
    bodySecondary = t("onboarding.confirmDate.unsureSecondary");
  }

  function confirm() {
    setStep(5);
    trackEvent("onboarding_date_confirmed", { step: "confirm-date" });
    router.push(href("/onboarding/impact"));
  }

  return (
    <OnboardingShell
      step={4}
      backHref="/onboarding/last-gamble"
      title={
        hasDate
          ? t("onboarding.confirmDate.title")
          : t("onboarding.confirmDate.journeyStarts")
      }
      footer={
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full justify-center"
            showArrow={false}
            onClick={confirm}
          >
            {t("onboarding.confirmDate.confirm")}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full justify-center"
            showArrow={false}
            href={href("/onboarding/last-gamble")}
          >
            {t("common.back")}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 rounded-[24px] bg-card/70 p-5 ring-1 ring-border">
        <p
          className={
            exact
              ? "text-xl font-semibold tracking-[-0.03em] text-foreground"
              : "text-[15px] leading-relaxed text-foreground"
          }
        >
          {bodyPrimary}
        </p>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {bodySecondary}
        </p>
      </div>
    </OnboardingShell>
  );
}
