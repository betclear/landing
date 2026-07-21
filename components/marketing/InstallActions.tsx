"use client";

import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

export function InstallActions() {
  const { t } = useLocale();

  return (
    <div className="mt-8">
      <Button
        href="/api/profile"
        size="lg"
        onClick={() => trackEvent("profile_download_clicked")}
      >
        {t("install.downloadCta")}
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        {t("install.openDirectly")}{" "}
        {/* Native anchor: profile download is an API route, not an App Router page. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/profile"
          className="font-medium text-foreground underline-offset-4 hover:underline"
          onClick={() =>
            trackEvent("profile_download_clicked", { source: "link" })
          }
        >
          /api/profile
        </a>
      </p>
    </div>
  );
}
