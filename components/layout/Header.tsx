"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between rounded-full border border-border/80 bg-background/75 px-3 pl-5 shadow-soft backdrop-blur-xl sm:h-16 sm:px-4 sm:pl-6">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-[-0.03em] text-foreground transition-opacity hover:opacity-70"
        >
          {SITE.name}
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex"
        >
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

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button href="/install" size="md" showArrow={false}>
            Get Protected
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
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
          "mx-auto mt-2 max-w-[1120px] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-elevated md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-1 p-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-1">
            <Button href="/install" className="w-full" size="md" showArrow={false}>
              Get Protected
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
