"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";

type PhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
};

export function PhoneFrame({ children, className, label }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[280px] sm:max-w-[300px]",
        className,
      )}
    >
      {label ? (
        <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      ) : null}
      <div className="phone-bezel rounded-[2.35rem] p-[10px] shadow-elevated ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-[1.85rem] bg-[#071012]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-10 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black/90"
          />
          <div className="aspect-[9/19.2] w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function BlockedSiteScreen({ domain = "betexample.com" }: { domain?: string }) {
  const { t } = useLocale();

  return (
    <div className="flex h-full flex-col bg-[#0d1a1c] px-5 pb-6 pt-12 text-[#f5f7f3]">
      <div className="rounded-2xl bg-[#122326] px-3 py-2 text-[11px] text-[#a9bab6]">
        <span className="text-[#7ed6bc]">https://</span>
        {domain}
      </div>
      <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7ed6bc]/15 text-[#7ed6bc]">
          <span className="text-xl font-semibold">✕</span>
        </div>
        <p className="mt-5 text-lg font-semibold tracking-[-0.03em]">
          {t("phone.siteBlocked")}
        </p>
        <p className="mt-2 max-w-[16rem] text-[13px] leading-relaxed text-[#a9bab6]">
          {t("phone.siteBlockedDetail")}
        </p>
        <div className="mt-6 rounded-full bg-[#7ed6bc]/12 px-3 py-1.5 text-[11px] font-medium text-[#7ed6bc]">
          {t("phone.protectionActive")}
        </div>
      </div>
    </div>
  );
}

export function ProtectionStatusScreen() {
  const { t } = useLocale();

  return (
    <div className="flex h-full flex-col bg-[#0d1a1c] px-5 pb-6 pt-12 text-[#f5f7f3]">
      <p className="text-[11px] uppercase tracking-[0.16em] text-[#a9bab6]">
        {SITE.name}
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
        {t("phone.protectionActive")}
      </h3>
      <div className="mt-6 space-y-3">
        {[
          [t("phone.dns"), t("phone.encrypted")],
          [t("phone.coverage"), t("phone.gamblingDomains")],
          [t("phone.status"), t("phone.holding")],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl bg-[#122326] px-4 py-3"
          >
            <span className="text-[13px] text-[#a9bab6]">{label}</span>
            <span className="text-[13px] font-medium text-[#7ed6bc]">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto rounded-2xl bg-[#193035] p-4">
        <p className="text-[12px] leading-relaxed text-[#a9bab6]">
          {t("phone.decisionProtected")}
        </p>
      </div>
    </div>
  );
}

export function ProgressDashboardScreen() {
  const { t } = useLocale();

  return (
    <div className="flex h-full flex-col bg-[#0d1a1c] px-4 pb-5 pt-12 text-[#f5f7f3]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#a9bab6]">
          {t("phone.progress")}
        </p>
        <span className="rounded-full bg-[#7ed6bc]/12 px-2 py-1 text-[10px] text-[#7ed6bc]">
          {t("phone.sampleUi")}
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">18 days</p>
      <p className="mt-1 text-[12px] text-[#a9bab6]">{t("phone.timeWithoutGambling")}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {[
          ["47", t("phone.attemptsBlocked")],
          ["$620", t("phone.moneySaved")],
          ["11h", t("phone.timeRecovered")],
          ["3", t("phone.weekStreak")],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl bg-[#122326] p-3">
            <p className="text-lg font-semibold tracking-[-0.03em] text-[#7ed6bc]">
              {value}
            </p>
            <p className="mt-1 text-[10px] leading-snug text-[#a9bab6]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GamblingAttemptScreen() {
  const { t } = useLocale();

  return (
    <div className="flex h-full flex-col bg-[#101418] px-5 pb-6 pt-12 text-white">
      <div className="rounded-2xl bg-[#1c2228] px-3 py-2 text-[11px] text-white/55">
        https://betexample.com
      </div>
      <div className="mt-6 rounded-3xl bg-gradient-to-b from-[#243038] to-[#161b20] p-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
          {t("phone.liveOdds")}
        </p>
        <p className="mt-3 text-xl font-semibold tracking-[-0.03em]">
          {t("phone.gamblingAttempt")}
        </p>
        <div className="mt-5 space-y-2">
          {["Home 1.92", "Draw 3.40", "Away 4.10"].map((odd) => (
            <div
              key={odd}
              className="rounded-xl bg-white/5 px-3 py-2.5 text-[12px] text-white/70"
            >
              {odd}
            </div>
          ))}
        </div>
        <div className="mt-5 h-10 rounded-full bg-[#f4765a]/80" />
      </div>
    </div>
  );
}
