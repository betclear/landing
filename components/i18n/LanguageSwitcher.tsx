"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { CaretDown } from "@phosphor-icons/react";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  locales,
  localeToCookieValue,
  type AppLocale,
} from "@/lib/i18n/config";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
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
    short: code === "en" ? "EN" : "BR",
  }));
  const current = options.find((option) => option.code === locale) ?? options[0];

  function switchTo(next: AppLocale) {
    setOpen(false);
    if (next === locale) return;
    setLocaleCookie(next);
    startTransition(() => {
      router.replace(pathname, { locale: next });
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
          "transition-colors disabled:opacity-60",
          isFooter
            ? "border-white/15 bg-white/5 text-[#f5f7f3] hover:bg-white/10"
            : compact
              ? "hover:bg-black/[0.04]"
              : "hover:bg-[#e8efe9]",
        )}
        style={
          isFooter
            ? {
                display: "inline-flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                alignItems: "center",
                justifyContent: "center",
                gap: compact ? 4 : 6,
                height: 40,
                padding: compact ? "0 10px" : "0 16px",
                borderRadius: 40,
                borderWidth: 1,
                borderStyle: "solid",
                boxSizing: "border-box",
                fontFamily:
                  "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "18px",
                whiteSpace: "nowrap",
              }
            : compact
              ? {
                  display: "inline-flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 40,
                  border: "1px solid #D5E0DB",
                  background: "transparent",
                  color: "#0F2022",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }
              : {
                  display: "inline-flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 40,
                  border: "1px solid #d5e0db",
                  background: "#fff",
                  color: "#0F2022",
                  boxSizing: "border-box",
                  fontFamily:
                    "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
                  fontSize: 14,
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "18px",
                  whiteSpace: "nowrap",
                }
        }
      >
        <FlagCircle locale={locale} />
        {compact ? (
          <span
            style={{
              fontFamily:
                "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "18px",
              color: isFooter ? undefined : "#0F2022",
            }}
          >
            {current.short}
          </span>
        ) : (
          <span>{current.short}</span>
        )}
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
            "absolute right-0 z-50 min-w-[7.5rem] overflow-hidden rounded-[18px] border p-1.5 shadow-soft",
            isFooter
              ? "border-white/10 bg-[#0d1719] text-[#f5f7f3]"
              : "border-border bg-card text-foreground",
          )}
          style={{ top: "calc(100% + 8px)" }}
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
                    "flex h-10 w-full flex-nowrap items-center gap-2.5 rounded-full px-3 text-left text-[14px] font-semibold leading-[18px] tracking-[-0.01em] transition-colors text-[#0F2022]",
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
                  <span>{option.short}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
