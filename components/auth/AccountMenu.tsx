"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { signOutUser } from "@/components/auth/useAuthUser";
import { cn } from "@/lib/cn";

function initialFor(user: User): string {
  const source = user.email ?? user.user_metadata?.name ?? "?";
  return source.trim().charAt(0).toUpperCase() || "?";
}

export function AccountMenu({ user }: { user: User }) {
  const router = useRouter();
  const { href, t } = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function signOut() {
    setLoading(true);
    try {
      await signOutUser();
      setOpen(false);
      router.replace(href("/"));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const email = user.email ?? "";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("common.account")}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-foreground transition-colors",
          "hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        {initialFor(user)}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }
            }
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 origin-top-right overflow-hidden rounded-[1.25rem] border border-border bg-card/95 shadow-elevated backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-foreground">
                {initialFor(user)}
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">
                  {t("common.signedIn")}
                </span>
                <span className="block truncate text-sm font-medium text-foreground">
                  {email}
                </span>
              </span>
            </div>
            <div className="p-1.5">
              <button
                type="button"
                role="menuitem"
                disabled={loading}
                onClick={signOut}
                className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-60"
              >
                <SignOut size={17} />
                {loading ? t("common.signingOut") : t("common.signOut")}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
