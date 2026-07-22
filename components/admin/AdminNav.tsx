"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SignOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ADMIN_REQUESTS_CHANGED_EVENT } from "@/lib/admin/events";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin/domains", label: "Domains" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/users", label: "Users" },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  const loadPendingCount = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/submissions?status=pending");
      if (!response.ok) return;
      const data = (await response.json()) as { total?: number };
      setPendingCount(data.total ?? 0);
    } catch {
      // Ignore badge errors; pages still load their own data.
    }
  }, []);

  useEffect(() => {
    void loadPendingCount();
  }, [loadPendingCount, pathname]);

  useEffect(() => {
    const onChange = () => {
      void loadPendingCount();
    };
    window.addEventListener(ADMIN_REQUESTS_CHANGED_EVENT, onChange);
    return () => {
      window.removeEventListener(ADMIN_REQUESTS_CHANGED_EVENT, onChange);
    };
  }, [loadPendingCount]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-foreground">
            BetClear
          </h1>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          showArrow={false}
          onClick={() => void logout()}
          className="self-start sm:self-auto"
        >
          <SignOut size={16} />
          Sign out
        </Button>
      </div>

      <nav
        aria-label="Admin sections"
        className="mt-6 flex gap-1 border-b border-border"
      >
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const showBadge = tab.href === "/admin/requests" && pendingCount != null;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative -mb-px inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-b-2 border-primary text-foreground"
                  : "border-b-2 border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {showBadge && pendingCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-primary">
                  {pendingCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </Container>
  );
}
