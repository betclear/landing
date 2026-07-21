"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

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

  function startProtection() {
    trackEvent("profile_download_clicked");

    const anchor = document.createElement("a");
    anchor.href = profileUrl;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    onStarted?.();

    const guidePath = accessToken
      ? `/install/guide?access=${encodeURIComponent(accessToken)}`
      : "/install/guide";

    window.setTimeout(() => {
      router.push(href(guidePath));
    }, 450);
  }

  return (
    <div className="mt-8">
      <Button size="lg" showArrow={false} onClick={startProtection}>
        {t("install.downloadCta")}
      </Button>
    </div>
  );
}
