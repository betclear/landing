"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/constants";
import { ONBOARDING_STEPS } from "@/lib/onboarding/types";

type OnboardingShellProps = {
  step: number;
  title: string;
  description?: string;
  backHref?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function OnboardingShell({
  step,
  title,
  description,
  backHref,
  children,
  footer,
  className,
}: OnboardingShellProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { t, href } = useLocale();
  const total = ONBOARDING_STEPS.length;
  const progress = Math.min(step / total, 1);
  const localizedBackHref = backHref ? href(backHref) : undefined;

  useEffect(() => {
    headingRef.current?.focus();
  }, [step, title]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-20%] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_68%)]" />
        <div className="absolute inset-0 marketing-grain opacity-20" />
      </div>

      <header className="relative z-10 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <Container className="flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {localizedBackHref ? (
              <Link
                href={localizedBackHref}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                aria-label={t("onboarding.goBack")}
              >
                <CaretLeft size={20} weight="bold" />
              </Link>
            ) : (
              <span className="h-10 w-10" aria-hidden="true" />
            )}
            <Link
              href={href("/")}
              className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground"
            >
              {SITE.name}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("onboarding.progressLabel", {
              current: Math.min(step, total),
              total,
            })}
          </p>
        </Container>
        <div className="h-1 w-full bg-surface">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${progress * 100}%` }}
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label={t("onboarding.progressAria")}
          />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <Container
          className={cn(
            "flex w-full max-w-lg flex-1 flex-col px-5 pb-28 pt-8 sm:px-8 sm:pt-12",
            className,
          )}
        >
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.04em] text-foreground outline-none sm:text-[2rem]"
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          <div className="mt-8 flex-1">{children}</div>
        </Container>
      </main>

      {footer ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/70 bg-background/90 backdrop-blur-md">
          <Container className="max-w-lg px-5 py-4 sm:px-8">{footer}</Container>
        </div>
      ) : null}
    </div>
  );
}
