"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { trackEvent } from "@/lib/analytics";

export function InstallDownloadButton({
  profileUrl,
  accessToken,
}: {
  profileUrl: string;
  accessToken?: string | null;
}) {
  const { t, href } = useLocale();
  const router = useRouter();

  function goToGuide() {
    const guidePath = accessToken
      ? `/install/guide?access=${encodeURIComponent(accessToken)}`
      : "/install/guide";

    // Give Safari a moment to start the .mobileconfig download before we
    // navigate to the install instructions.
    window.setTimeout(() => {
      router.push(href(guidePath));
    }, 450);
  }

  return (
    <div className="mt-8">
      <Button
        href={profileUrl}
        size="lg"
        onClick={() => {
          trackEvent("profile_download_clicked");
          goToGuide();
        }}
      >
        {t("install.downloadCta")}
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        {t("install.openDirectly")}{" "}
        <a
          href={profileUrl}
          className="font-medium text-foreground underline-offset-4 hover:underline"
          onClick={() => {
            trackEvent("profile_download_clicked", { source: "link" });
            goToGuide();
          }}
        >
          {profileUrl}
        </a>
      </p>
    </div>
  );
}
