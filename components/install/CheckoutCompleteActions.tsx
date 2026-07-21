"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";

type CheckoutCompleteActionsProps = {
  safariHandoffUrl: string;
  requireCopyHandoff: boolean;
};

export function CheckoutCompleteActions({
  safariHandoffUrl,
  requireCopyHandoff,
}: CheckoutCompleteActionsProps) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function copyLink() {
    setCopyError(null);

    try {
      await navigator.clipboard.writeText(safariHandoffUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(t("installComplete.copyError"));
    }
  }

  return (
    <div className="mt-8 space-y-4">
      {requireCopyHandoff ? (
        <Button size="lg" showArrow={false} onClick={copyLink}>
          {copied
            ? t("installComplete.linkCopiedOpenSafari")
            : t("installComplete.copyLinkForSafari")}
        </Button>
      ) : (
        <Button href={safariHandoffUrl} size="lg">
          {t("installComplete.continueCta")}
        </Button>
      )}

      {!requireCopyHandoff ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            size="lg"
            showArrow={false}
            onClick={copyLink}
          >
            {copied
              ? t("installComplete.linkCopied")
              : t("installComplete.copySafariLink")}
          </Button>
        </div>
      ) : null}

      {copyError ? (
        <p className="text-sm text-red-600">{copyError}</p>
      ) : null}

      <p className="text-sm leading-relaxed text-muted-foreground">
        {requireCopyHandoff
          ? t("installComplete.chromeHandoffNote")
          : t("installComplete.safariHandoffNote")}
      </p>

      <p className="break-all rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3 font-mono text-xs text-muted-foreground">
        {safariHandoffUrl}
      </p>
    </div>
  );
}
