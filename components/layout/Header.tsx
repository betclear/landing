"use client";

import { Link } from "@/lib/i18n/navigation";
import { useRouter } from "@/lib/i18n/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, SignOut, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { signOutUser, useAuthUser } from "@/components/auth/useAuthUser";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const { locale, t } = useLocale();
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
        { href: "/#how-it-works", label: t("nav.howItWorks") },
        { href: "/#protection", label: t("nav.protection") },
        { href: "/guides", label: t("nav.guides") },
        { href: "/support", label: t("nav.support") },
        { href: "/#faq", label: t("nav.faq") },
      ];
    }

    return [
      { href: "/#how-it-works", label: t("nav.howItWorks") },
      { href: "/#protection", label: t("nav.protection") },
      { href: "/guides", label: t("nav.guides") },
      { href: "/#pricing", label: t("nav.pricing") },
      { href: "/#faq", label: t("nav.faq") },
    ];
  }, [locale, t]);

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
  // Only send paying subscribers to install. Everyone else starts checkout.
  const startHref =
    authEnabled && user
      ? subscribed === true
        ? "/install"
        : "/pricing"
      : "/onboarding/spend";
  const loginHref = "/login";

  async function handleMobileSignOut() {
    setSigningOut(true);
    try {
      await signOutUser();
      close();
      router.replace("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4">
      <div
        className={cn(
          "relative mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full px-3 pl-5 sm:h-16 sm:px-4 sm:pl-6",
        )}
        style={{
          backgroundColor: scrolled ? "#fff" : "rgba(255,255,255,0)",
          boxShadow: scrolled
            ? "0 1px 2px rgba(16,32,34,0.06), 0 14px 32px rgba(16,32,34,0.08)"
            : "0 1px 2px rgba(16,32,34,0), 0 14px 32px rgba(16,32,34,0)",
          transition:
            "background-color 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <Link
          href={"/"}
          className="inline-flex items-center transition-opacity hover:opacity-80"
          aria-label={SITE.name}
        >
          <BrandLogo height={28} priority />
        </Link>

        <nav
          aria-label={t("common.primaryNav")}
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center lg:flex"
        >
          <div className="pointer-events-auto flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="header-nav-link transition-opacity duration-200 hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
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
          <LanguageSwitcher compact />
          {authEnabled && user ? (
            <AccountMenu user={user} subscribed={subscribed ?? false} />
          ) : null}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher compact />
          <motion.button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-haspopup="dialog"
            aria-label={open ? t("common.closeMenu") : t("common.openMenu")}
            onClick={() => setOpen((value) => !value)}
            whileTap={reduce ? undefined : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
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
                    className="header-nav-link rounded-[var(--radius-md)] px-3 py-3 transition-colors hover:bg-surface"
                  >
                    {link.label}
                  </Link>
                ))}
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
                <div className="mt-1 flex items-center gap-2">
                  {authEnabled && !loading && !user ? (
                    <Button
                      href={loginHref}
                      variant="secondary"
                      size="md"
                      showArrow={false}
                      className="min-w-0 flex-1 px-3"
                      onClick={close}
                    >
                      {t("nav.signIn")}
                    </Button>
                  ) : null}
                  <Button
                    href={startHref}
                    size="md"
                    showArrow={false}
                    className="min-w-0 flex-1 px-3"
                    onClick={() => {
                      close();
                      trackEvent("hero_start_protection_clicked", {
                        source: "mobile_nav",
                      });
                    }}
                  >
                    {t("nav.startProtection")}
                  </Button>
                  <LanguageSwitcher compact />
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
