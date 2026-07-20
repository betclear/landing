"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function InstallActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to open billing portal");
      }

      window.location.href = data.url;
    } catch (portalError) {
      setError(
        portalError instanceof Error
          ? portalError.message
          : "Unable to open billing portal",
      );
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 border-t border-border pt-8">
      <p className="text-sm text-muted-foreground">
        Need to update your card, switch plans, or cancel?
      </p>
      {error ? (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      ) : null}
      <div className="mt-4">
        <Button
          variant="secondary"
          showArrow={false}
          disabled={loading}
          onClick={openPortal}
        >
          {loading ? "Opening..." : "Manage billing"}
        </Button>
      </div>
    </div>
  );
}
