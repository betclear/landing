"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, SignOut, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { signOutUser, useAuthUser } from "@/components/auth/useAuthUser";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const { locale, t, href } = useLocale();
  const router = useRouter();
  const { user, loading } = useAuthUser();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);
  const reduce = useReducedMotion();
  const titleId = useId();

  const authEnabled = isSupabaseAuthConfigured();

  const navLinks = useMemo(() => {
    if (locale === "br") {
      return [
        { href: href("/#how-it-works"), label: t("nav.howItWorks") },
        { href: href("/#protection"), label: t("nav.protection") },
        { href: href("/guides"), label: t("nav.guides") },
        { href: href("/support"), label: t("nav.support") },
        { href: href("/#faq"), label: t("nav.faq") },
      ];
    }

    return [
      { href: href("/#how-it-works"), label: t("nav.howItWorks") },
      { href: href("/#protection"), label: t("nav.protection") },
      { href: href("/guides"), label: t("nav.guides") },
      { href: href("/#pricing"), label: t("nav.pricing") },
      { href: href("/#faq"), label: t("nav.faq") },
    ];
  }, [href, locale, t]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!authEnabled || !user) {
      setSubscribed(null);
      return;
    }

    let active = true;
    fetch("/api/subscription/status")
      .then((response) => response.json())
      .then((data: { subscribed?: boolean }) => {
        if (active) setSubscribed(Boolean(data.subscribed));
      })
      .catch(() => {
        if (active) setSubscribed(false);
      });

    return () => {
      active = false;
    };
  }, [authEnabled, user]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);
  const startHref =
    authEnabled && user
      ? subscribed
        ? href("/install")
        : href("/pricing")
      : href("/onboarding/spend");
  const loginHref = href("/login");

  async function handleMobileSignOut() {
    setSigningOut(true);
    try {
      await signOutUser();
      close();
      router.replace(href("/"));
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full px-3 pl-5 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-16 sm:px-4 sm:pl-6",
          scrolled
            ? "border border-border/80 bg-background/80 shadow-soft backdrop-blur-xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <Link
          href={href("/")}
          className="text-[15px] font-semibold tracking-[-0.04em] text-foreground transition-opacity hover:opacity-70"
        >
          {SITE.name}
        </Link>

        <nav
          aria-label={t("common.primaryNav")}
          className="hidden items-center gap-7 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          {authEnabled && !loading && !user ? (
            <Button href={loginHref} variant="secondary" size="md" showArrow={false}>
              {t("nav.signIn")}
            </Button>
          ) : null}
          <Button
            href={startHref}
            size="md"
            showArrow={false}
            onClick={() =>
              trackEvent("hero_start_protection_clicked", { source: "header" })
            }
          >
            {t("nav.startProtection")}
          </Button>
          {authEnabled && user ? (
            <AccountMenu user={user} subscribed={subscribed ?? false} />
          ) : null}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            href={startHref}
            size="md"
            showArrow={false}
            className="h-9 px-3 text-xs"
            onClick={() =>
              trackEvent("hero_start_protection_clicked", {
                source: "header_mobile",
              })
            }
          >
            {t("nav.startShort")}
          </Button>
          <motion.button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-haspopup="dialog"
            aria-label={open ? t("common.closeMenu") : t("common.openMenu")}
            onClick={() => setOpen((value) => !value)}
            whileTap={reduce ? undefined : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground"
          >
            {open ? <X size={18} /> : <List size={18} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <div className="lg:hidden" key="mobile-nav-root">
            <motion.button
              type="button"
              aria-label={t("common.closeMenu")}
              className="fixed inset-0 z-40 bg-black/45"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.18, ease: easeOut }
              }
              onClick={close}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="fixed inset-x-4 top-[4.5rem] z-50 origin-top overflow-hidden rounded-[1.75rem] border border-border bg-card/95 shadow-elevated backdrop-blur-xl"
              initial={
                reduce ? false : { opacity: 0, y: -8, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: -6,
                      scale: 0.98,
                      transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
                    }
              }
              transition={
                reduce ? { duration: 0 } : { duration: 0.22, ease: easeOut }
              }
            >
              <p id={titleId} className="sr-only">
                {t("common.navigationMenu")}
              </p>
              <div className="flex flex-col gap-1 p-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className="rounded-[var(--radius-md)] px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-3 py-2">
                  <LanguageSwitcher />
                </div>
                {authEnabled && user ? (
                  <div className="mt-1 flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2.5">
                    <span className="min-w-0">
                      <span className="block text-xs text-muted-foreground">
                        {t("common.signedIn")}
                      </span>
                      <span className="block truncate text-sm font-medium text-foreground">
                        {user.email}
                      </span>
                    </span>
                    <button
                      type="button"
                      disabled={signingOut}
                      onClick={handleMobileSignOut}
                      aria-label={t("common.signOut")}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
                    >
                      <SignOut size={17} />
                    </button>
                  </div>
                ) : null}
                {authEnabled && !loading && !user ? (
                  <Button
                    href={loginHref}
                    variant="secondary"
                    className="w-full"
                    size="md"
                    showArrow={false}
                    onClick={close}
                  >
                    {t("nav.signIn")}
                  </Button>
                ) : null}
                <div className="pt-1">
                  <Button
                    href={startHref}
                    className="w-full"
                    size="md"
                    showArrow={false}
                    onClick={() => {
                      close();
                      trackEvent("hero_start_protection_clicked", {
                        source: "mobile_nav",
                      });
                    }}
                  >
                    {t("nav.startProtection")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
