"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

export function InstallDownloadButton({ profileUrl }: { profileUrl: string }) {
  const { t } = useLocale();

  return (
    <div className="mt-8">
      <Button
        href={profileUrl}
        size="lg"
        onClick={() => trackEvent("profile_download_clicked")}
      >
        {t("install.downloadCta")}
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        {t("install.openDirectly")}{" "}
        <a
          href={profileUrl}
          className="font-medium text-foreground underline-offset-4 hover:underline"
          onClick={() =>
            trackEvent("profile_download_clicked", { source: "link" })
          }
        >
          {profileUrl}
        </a>
      </p>
    </div>
  );
}
