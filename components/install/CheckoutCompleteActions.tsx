"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type CheckoutCompleteActionsProps = {
  safariHandoffUrl: string;
  showIosHint: boolean;
};

export function CheckoutCompleteActions({
  safariHandoffUrl,
  showIosHint,
}: CheckoutCompleteActionsProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function copyLink() {
    setCopyError(null);

    try {
      await navigator.clipboard.writeText(safariHandoffUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError("Unable to copy. Long-press the link below and choose Copy.");
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <Button href={safariHandoffUrl} size="lg">
        Continue in Safari
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" size="lg" showArrow={false} onClick={copyLink}>
          {copied ? "Link copied" : "Copy Safari link"}
        </Button>
      </div>

      {copyError ? (
        <p className="text-sm text-red-600 dark:text-red-400">{copyError}</p>
      ) : null}

      <p className="text-sm leading-relaxed text-muted-foreground">
        {showIosHint ? (
          <>
            iPhone profiles must be installed in Safari. If you paid in Chrome,
            copy the link below, open Safari, paste it into the address bar, and
            press Go.
          </>
        ) : (
          <>
            Open the link below in Safari on your iPhone to unlock profile
            download. Subscription access is saved per browser until you open
            this link in Safari.
          </>
        )}
      </p>

      <p className="break-all rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3 font-mono text-xs text-muted-foreground">
        {safariHandoffUrl}
      </p>
    </div>
  );
}
