"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

type InstallGuideProps = {
  profileUrl: string;
};

type StepVisual =
  | { src: string; alt: string; fit: "icon" | "height" }
  | { fit: "celebrate" };

const STEP_VISUALS: Record<number, StepVisual> = {
  0: {
    src: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Settings_%28iOS%29.png",
    alt: "iOS Settings",
    fit: "icon",
  },
  1: {
    src: "/install/guide-step-2.png",
    alt: "iOS Settings with Profile Downloaded",
    fit: "height",
  },
  2: {
    src: "/install/guide-step-3.png",
    alt: "Install Profile with Install button highlighted",
    fit: "height",
  },
  3: {
    src: "/install/guide-step-4.png",
    alt: "Enter your passcode prompt",
    fit: "height",
  },
  4: {
    src: "/install/guide-step-5.png",
    alt: "Warning screen with Install button highlighted",
    fit: "height",
  },
  5: {
    src: "/install/guide-step-6.png",
    alt: "Confirm Install Profile dialog",
    fit: "height",
  },
  6: {
    src: "/install/guide-step-7.png",
    alt: "Profile Installed with Done checkmark highlighted",
    fit: "height",
  },
  7: {
    fit: "celebrate",
  },
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

export function InstallGuide({ profileUrl }: InstallGuideProps) {
  const { t, dictionary } = useLocale();
  const steps = dictionary.installGuide.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const step = steps[stepIndex];
  const visual = STEP_VISUALS[stepIndex];

  useEffect(() => {
    trackEvent("installation_guide_opened", { source: "guide" });
  }, []);

  useEffect(() => {
    trackEvent("installation_step_viewed", {
      step: String(stepIndex + 1),
    });
  }, [stepIndex]);

  useEffect(() => {
    if (!isLast) return;
    fireConfetti();
  }, [isLast, stepIndex]);

  async function copyDownloadLink() {
    try {
      const absolute =
        typeof window !== "undefined"
          ? new URL(profileUrl, window.location.origin).toString()
          : profileUrl;
      await navigator.clipboard.writeText(absolute);
      setCopyState("copied");
      trackEvent("profile_download_clicked", { source: "guide_copy" });
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
        <h1 className="text-center text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-left sm:text-5xl">
          {isLast ? step.title : t("installGuide.title")}
        </h1>

        <div className="mt-8 rounded-[1.5rem] bg-card p-6 ring-1 ring-border sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[12px] text-primary">
              {stepIndex + 1} / {steps.length}
            </p>
            <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {t("installGuide.profileName")}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="relative mt-5 flex w-full items-center justify-center bg-surface"
            style={{ aspectRatio: "10 / 7", borderRadius: 16 }}
          >
            {visual?.fit === "icon" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={visual.src}
                alt={visual.alt}
                width={100}
                height={100}
                className="h-[100px] w-[100px] object-contain"
              />
            ) : null}
            {visual?.fit === "height" ? (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                style={{
                  height: "80%",
                  aspectRatio: "1024 / 891",
                  borderRadius: 16,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visual.src}
                  alt={visual.alt}
                  width={1024}
                  height={891}
                  className="block h-full w-full object-cover"
                />
              </div>
            ) : null}
            {visual?.fit === "celebrate" ? (
              <CheckCircle
                size={100}
                weight="fill"
                className="text-primary"
              />
            ) : null}
          </div>

          {isLast ? (
            <p className="mt-5 text-center text-[15px] leading-relaxed text-muted-foreground sm:text-left">
              {step.detail}
            </p>
          ) : (
            <>
              <h2 className="mt-5 text-center text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-left">
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
            {isFirst ? (
              <Button
                href={profileUrl}
                size="lg"
                showArrow={false}
                onClick={() =>
                  trackEvent("profile_download_clicked", {
                    source: "guide_step_1",
                  })
                }
              >
                {t("installGuide.downloadCta")}
              </Button>
            ) : null}
            {!isLast ? (
              <Button
                variant={isFirst ? "secondary" : "primary"}
                size="lg"
                showArrow={false}
                onClick={() =>
                  setStepIndex((value) => Math.min(steps.length - 1, value + 1))
                }
              >
                {t("installGuide.next")}
              </Button>
            ) : (
              <Button href={"/"} size="lg" showArrow={false}>
                {t("installGuide.doneCta")}
              </Button>
            )}
            {!isFirst ? (
              <Button
                variant="secondary"
                size="lg"
                showArrow={false}
                onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
              >
                {t("installGuide.back")}
              </Button>
            ) : null}
          </div>
        </div>

        {!isLast ? (
          <div className="mt-12 space-y-8 border-t border-border pt-10">
            <section>
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                {t("installGuide.troubleDownloadTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("installGuide.troubleDownloadBody")}
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href={profileUrl}
                  size="lg"
                  showArrow={false}
                  onClick={() =>
                    trackEvent("profile_download_clicked", {
                      source: "guide_again",
                    })
                  }
                >
                  {t("installGuide.downloadAgain")}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  showArrow={false}
                  onClick={copyDownloadLink}
                >
                  {copyState === "copied"
                    ? t("installGuide.linkCopied")
                    : t("installGuide.copyDownloadLink")}
                </Button>
              </div>
              {copyState === "error" ? (
                <p className="mt-2 text-sm text-red-600">
                  {t("installGuide.copyError")}
                </p>
              ) : null}
              <p className="mt-3 break-all text-sm text-muted-foreground">
                <a
                  href={profileUrl}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {profileUrl}
                </a>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                {t("installGuide.troubleInstallTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("installGuide.troubleInstallBody")}
              </p>
              <div className="mt-4">
                <Button
                  href={`mailto:${SITE.email}`}
                  variant="secondary"
                  size="lg"
                  showArrow={false}
                >
                  {t("installGuide.contactSupport")}
                </Button>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
