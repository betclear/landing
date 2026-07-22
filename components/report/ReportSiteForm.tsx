"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function ReportSiteForm() {
  const { t } = useLocale();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/domain-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await response.json()) as {
        error?: string;
        code?: string;
      };

      if (!response.ok) {
        if (data.code === "already_blocked") {
          setError(t("reportSite.alreadyBlocked"));
        } else if (data.code === "already_pending") {
          setError(t("reportSite.alreadyPending"));
        } else if (response.status === 429) {
          setError(t("reportSite.rateLimited"));
        } else {
          setError(data.error ?? t("reportSite.error"));
        }
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setUrl("");
      setSubmitting(false);
    } catch {
      setError(t("reportSite.error"));
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mt-10 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-soft">
        <p className="text-lg font-semibold tracking-[-0.03em] text-foreground">
          {t("reportSite.successTitle")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("reportSite.successDescription")}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          showArrow={false}
          className="mt-5"
          onClick={() => setSuccess(false)}
        >
          {t("reportSite.submitAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 space-y-4 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-soft"
    >
      <div className="space-y-2">
        <label
          htmlFor="report-site-url"
          className="block text-sm font-medium text-foreground"
        >
          {t("reportSite.inputLabel")}
        </label>
        <input
          id="report-site-url"
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder={t("reportSite.inputPlaceholder")}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="h-12 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        showArrow={false}
        disabled={submitting || !url.trim()}
        className="w-full sm:w-auto"
      >
        {submitting ? t("reportSite.submitting") : t("reportSite.submit")}
      </Button>
    </form>
  );
}
