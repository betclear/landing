"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  locales,
  localeToCookieValue,
  type AppLocale,
} from "@/lib/i18n/config";
import { switchLocalePath } from "@/lib/i18n/routing";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";

function setLocaleCookie(locale: AppLocale) {
  const value = localeToCookieValue(locale);
  document.cookie = `${LOCALE_COOKIE}=${value};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
}

type LanguageSwitcherProps = {
  className?: string;
  variant?: "header" | "footer";
};

export function LanguageSwitcher({
  className,
  variant = "header",
}: LanguageSwitcherProps) {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: AppLocale) {
    if (next === locale) return;
    setLocaleCookie(next);
    const hash =
      typeof window !== "undefined" ? window.location.hash : undefined;
    const target = switchLocalePath(pathname, next, hash || undefined);
    startTransition(() => {
      router.push(target);
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1",
        variant === "footer" && "text-[#a9bab6]",
        className,
      )}
      role="group"
      aria-label={t("language.label")}
    >
      {locales.map((code) => {
        const active = code === locale;
        const label =
          code === "en" ? t("language.english") : t("language.portuguese");
        return (
          <button
            key={code}
            type="button"
            disabled={pending}
            aria-pressed={active}
            onClick={() => switchTo(code)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? variant === "footer"
                  ? "bg-white/10 text-white"
                  : "bg-primary/15 text-foreground"
                : variant === "footer"
                  ? "text-[#a9bab6] hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
