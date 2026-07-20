"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full px-3 pl-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-16 sm:px-4 sm:pl-6",
          scrolled
            ? "border border-border/80 bg-background/80 shadow-soft backdrop-blur-xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-[-0.04em] text-foreground transition-opacity hover:opacity-70"
        >
          {SITE.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            href={SITE.startHref}
            size="md"
            showArrow={false}
            onClick={() =>
              trackEvent("hero_start_protection_clicked", { source: "header" })
            }
          >
            Start Protection
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            href={SITE.startHref}
            size="md"
            showArrow={false}
            className="h-9 px-3 text-xs"
            onClick={() =>
              trackEvent("hero_start_protection_clicked", { source: "header_mobile" })
            }
          >
            Start
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground"
          >
            {open ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-4 top-[4.5rem] z-40 overflow-hidden rounded-[1.75rem] border border-border bg-card/95 shadow-elevated backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 p-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-md)] px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-1">
            <Button
              href={SITE.startHref}
              className="w-full"
              size="md"
              showArrow={false}
              onClick={() => {
                setOpen(false);
                trackEvent("hero_start_protection_clicked", {
                  source: "mobile_nav",
                });
              }}
            >
              Start Protection
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
