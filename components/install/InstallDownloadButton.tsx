"use client";

import { useRouter } from "@/lib/i18n/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function InstallDownloadButton({
  accessToken,
}: {
  accessToken?: string | null;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  function handleClick() {
    if (busy) return;

    setBusy(true);

    const guidePath = accessToken
      ? `/install/guide?access=${encodeURIComponent(accessToken)}`
      : "/install/guide";

    router.push(guidePath);
  }

  return (
    <div className="mt-8">
      <Button size="lg" showArrow={false} onClick={handleClick}>
        {busy ? t("common.opening") : t("install.downloadCta")}
      </Button>
    </div>
  );
}
