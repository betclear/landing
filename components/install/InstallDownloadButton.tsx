"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

/** Give Safari time to surface the profile download before opening instructions. */
const GUIDE_NAV_DELAY_MS = 2000;

export function InstallDownloadButton({
  profileUrl,
  accessToken,
  onStarted,
}: {
  profileUrl: string;
  accessToken?: string | null;
  onStarted?: () => void;
}) {
  const { t, href } = useLocale();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const guideTimerRef = useRef<number | null>(null);

  function scheduleGuide() {
    if (guideTimerRef.current !== null) return;

    const guidePath = accessToken
      ? `/install/guide?access=${encodeURIComponent(accessToken)}`
      : "/install/guide";

    guideTimerRef.current = window.setTimeout(() => {
      guideTimerRef.current = null;
      router.push(href(guidePath));
      setBusy(false);
    }, GUIDE_NAV_DELAY_MS);
  }

  function handleClick() {
    if (busy) return;

    setBusy(true);
    trackEvent("profile_download_clicked");
    onStarted?.();

    // Leave the native <a href> default action intact so iOS Safari starts
    // the profile download from the real user tap. Open instructions after
    // the download prompt has had time to appear.
    scheduleGuide();
  }

  return (
    <div className="mt-8">
      <Button
        href={profileUrl}
        size="lg"
        showArrow={false}
        onClick={handleClick}
      >
        {busy ? t("common.opening") : t("install.downloadCta")}
      </Button>
    </div>
  );
}
