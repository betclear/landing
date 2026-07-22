"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, Copy } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

type AndroidPrivateDnsGuideProps = {
  hostname: string;
};

function fireConfetti() {
  const colors = ["#1f6b5c", "#f4765a", "#102022", "#e8efe9"];

  void confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.55 },
    colors,
  });

  window.setTimeout(() => {
    void confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    void confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    });
  }, 220);
}

export function AndroidPrivateDnsGuide({
  hostname,
}: AndroidPrivateDnsGuideProps) {
  const { t, dictionary } = useLocale();
  const steps = dictionary.installAndroid.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const step = steps[stepIndex];

  useEffect(() => {
    trackEvent("android_guide_opened");
  }, []);

  useEffect(() => {
    trackEvent("android_step_viewed", { step: String(stepIndex + 1) });
  }, [stepIndex]);

  useEffect(() => {
    if (!isLast) return;
    fireConfetti();
  }, [isLast, stepIndex]);

  async function copyHostname() {
    try {
      await navigator.clipboard.writeText(hostname);
      setCopyState("copied");
      trackEvent("private_dns_hostname_copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 h-64 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-56 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_70%)]" />
      </div>

      <div className="relative">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
          {t("installAndroid.eyebrow")}
        </p>
        <h1 className="mt-3 text-center text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-left sm:text-5xl">
          {isLast ? step.title : t("installAndroid.title")}
        </h1>
        {!isLast ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {t("installAndroid.description")}
          </p>
        ) : null}

        <div className="mt-8 rounded-[1.5rem] bg-card p-6 ring-1 ring-border sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[12px] text-primary">
              {stepIndex + 1} / {steps.length}
            </p>
            <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {t("installAndroid.profileName")}
            </p>
          </div>

          {!isLast ? (
            <div className="mt-5 rounded-2xl bg-surface p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {t("installAndroid.hostnameLabel")}
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <code className="flex-1 select-all break-all rounded-xl bg-card px-4 py-3 font-mono text-base text-foreground ring-1 ring-border">
                  {hostname}
                </code>
                <Button
                  size="lg"
                  variant="secondary"
                  showArrow={false}
                  onClick={copyHostname}
                >
                  <Copy size={18} weight="bold" className="mr-2" />
                  {copyState === "copied"
                    ? t("installAndroid.copiedCta")
                    : t("installAndroid.copyCta")}
                </Button>
              </div>
              {copyState === "error" ? (
                <p className="mt-2 text-sm text-red-600">
                  {t("installAndroid.copyError")}
                </p>
              ) : null}
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="mt-5 flex w-full items-center justify-center bg-surface"
              style={{ aspectRatio: "10 / 7", borderRadius: 16 }}
            >
              <CheckCircle size={100} weight="fill" className="text-primary" />
            </div>
          )}

          {isLast ? (
            <p className="mt-5 text-center text-[15px] leading-relaxed text-muted-foreground sm:text-left">
              {step.detail}
            </p>
          ) : (
            <>
              <h2 className="mt-6 text-center text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-left">
                {step.title}
              </h2>
              {step.detail ? (
                <p className="mt-3 text-center text-[15px] leading-relaxed text-muted-foreground sm:text-left">
                  {step.detail}
                </p>
              ) : null}
            </>
          )}

          <div className="mt-8 flex flex-col gap-3">
            {!isLast ? (
              <Button
                size="lg"
                showArrow={false}
                onClick={() =>
                  setStepIndex((value) => Math.min(steps.length - 1, value + 1))
                }
              >
                {t("installAndroid.next")}
              </Button>
            ) : (
              <Button href={"/"} size="lg" showArrow={false}>
                {t("installAndroid.doneCta")}
              </Button>
            )}
            {!isFirst ? (
              <Button
                variant="secondary"
                size="lg"
                showArrow={false}
                onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
              >
                {t("installAndroid.back")}
              </Button>
            ) : null}
          </div>
        </div>

        {!isLast ? (
          <div className="mt-12 space-y-8 border-t border-border pt-10">
            <section>
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                {t("installAndroid.verifyTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("installAndroid.verifyBody")}
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                {t("installAndroid.troubleTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("installAndroid.troubleBody")}
              </p>
              <div className="mt-4">
                <Button
                  href={`mailto:${SITE.email}`}
                  variant="secondary"
                  size="lg"
                  showArrow={false}
                >
                  {t("installAndroid.contactSupport")}
                </Button>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
