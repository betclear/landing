"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";

type AccountActionsProps = {
  email: string;
};

export function AccountActions({ email }: AccountActionsProps) {
  const router = useRouter();
  const { href, t } = useLocale();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.replace(
        `${href("/login")}?next=${encodeURIComponent(href("/pricing"))}`,
      );
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-surface px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left">
      <p className="text-sm text-muted-foreground">
        {t("pricing.signedInAs", { email })}
      </p>
      <Button
        variant="secondary"
        size="md"
        showArrow={false}
        disabled={loading}
        onClick={signOut}
      >
        {loading ? t("common.signingOut") : t("common.signOut")}
      </Button>
    </div>
  );
}
