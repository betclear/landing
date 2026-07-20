"use client";

import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

export function InstallActions() {
  return (
    <div className="mt-8">
      <Button
        href="/api/profile"
        size="lg"
        onClick={() => trackEvent("profile_download_clicked")}
      >
        Download Profile
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        Or open directly:{" "}
        <a
          href="/api/profile"
          className="font-medium text-foreground underline-offset-4 hover:underline"
          onClick={() => trackEvent("profile_download_clicked", { source: "link" })}
        >
          /api/profile
        </a>
      </p>
    </div>
  );
}
