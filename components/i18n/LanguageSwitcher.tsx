"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CaretDown } from "@phosphor-icons/react";
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

function FlagCircle({
  locale,
  className,
}: {
  locale: AppLocale;
  className?: string;
}) {
  if (locale === "br") {
    return (
      <span
        className={cn(
          "relative inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10",
          className,
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-full w-full">
          <rect width="24" height="24" fill="#009C3B" />
          <polygon points="12,3.5 21.5,12 12,20.5 2.5,12" fill="#FFDF00" />
          <circle cx="12" cy="12" r="4.1" fill="#002776" />
          <path
            d="M8.2 11.2c1.4-.9 3-.9 4.5-.5.9.3 1.8.7 2.6 1.2"
            fill="none"
            stroke="#fff"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <rect width="24" height="24" fill="#B22234" />
        <rect y="1.85" width="24" height="1.85" fill="#fff" />
        <rect y="5.54" width="24" height="1.85" fill="#fff" />
        <rect y="9.23" width="24" height="1.85" fill="#fff" />
        <rect y="12.92" width="24" height="1.85" fill="#fff" />
        <rect y="16.62" width="24" height="1.85" fill="#fff" />
        <rect y="20.31" width="24" height="1.85" fill="#fff" />
        <rect width="10.5" height="12.9" fill="#3C3B6E" />
      </svg>
    </span>
  );
}

type LanguageSwitcherProps = {
  className?: string;
  variant?: "header" | "footer";
  /** Flag + chevron only — used in the mobile header bar */
  compact?: boolean;
};

export function LanguageSwitcher({
  className,
  variant = "header",
  compact = false,
}: LanguageSwitcherProps) {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const options = locales.map((code) => ({
    code,
    label: code === "en" ? t("language.english") : t("language.portuguese"),
  }));
  const current = options.find((option) => option.code === locale) ?? options[0];

  function switchTo(next: AppLocale) {
    setOpen(false);
    if (next === locale) return;
    setLocaleCookie(next);
    const hash =
      typeof window !== "undefined" ? window.location.hash : undefined;
    const target = switchLocalePath(pathname, next, hash || undefined);
    startTransition(() => {
      router.push(target);
    });
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isFooter = variant === "footer";

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        disabled={pending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t("language.label")}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-full border text-sm font-medium leading-none tracking-[-0.01em] transition-colors",
          // Match header CTA: Button size="md" is h-11
          compact ? "h-9 gap-1 px-2.5" : "h-11 px-4",
          isFooter
            ? "border-white/15 bg-white/5 text-[#f5f7f3] hover:bg-white/10"
            : "border-border bg-card/80 text-foreground hover:bg-surface",
        )}
      >
        <FlagCircle locale={locale} />
        {!compact ? (
          <span className="max-w-[7.5rem] truncate sm:max-w-none">
            {current.label}
          </span>
        ) : null}
        <CaretDown
          size={12}
          weight="bold"
          className={cn(
            "shrink-0 opacity-60 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("language.label")}
          className={cn(
            "absolute right-0 z-50 mt-2 min-w-[13rem] overflow-hidden rounded-[18px] border p-1.5 shadow-soft",
            isFooter
              ? "border-white/10 bg-[#0d1719] text-[#f5f7f3]"
              : "border-border bg-card text-foreground",
          )}
        >
          {options.map((option) => {
            const active = option.code === locale;
            return (
              <li key={option.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => switchTo(option.code)}
                  className={cn(
                    "flex h-11 w-full items-center gap-2.5 rounded-full px-3 text-left text-sm font-medium leading-none tracking-[-0.01em] transition-colors",
                    active
                      ? isFooter
                        ? "bg-white/10"
                        : "bg-primary/12"
                      : isFooter
                        ? "hover:bg-white/5"
                        : "hover:bg-surface",
                  )}
                >
                  <FlagCircle locale={option.code} />
                  <span>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
