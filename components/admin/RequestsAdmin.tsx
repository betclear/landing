"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { notifyAdminRequestsChanged } from "@/lib/admin/events";
import type { DomainSubmission } from "@/lib/supabase/types";

export function RequestsAdmin() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<DomainSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/admin/submissions?status=pending");
    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }

    const data = (await response.json()) as {
      submissions?: DomainSubmission[];
      error?: string;
    };

    if (!response.ok) {
      setError(data.error ?? "Failed to load submissions");
      setLoading(false);
      return;
    }

    setSubmissions(data.submissions ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  async function reviewSubmission(
    submission: DomainSubmission,
    action: "approve" | "reject",
  ) {
    setError(null);
    setWarning(null);
    setReviewingId(submission.id);

    const response = await fetch(`/api/admin/submissions/${submission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const data = (await response.json()) as {
      error?: string;
      refreshWarning?: string | null;
    };

    setReviewingId(null);

    if (!response.ok) {
      setError(data.error ?? "Failed to review submission");
      return;
    }

    setWarning(data.refreshWarning ?? null);
    await loadSubmissions();
    notifyAdminRequestsChanged();
  }

  return (
    <Container>
      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
          Requests
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sites people asked us to block. Approve to add them to the live list.
        </p>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {warning ? (
        <p className="mt-4 text-sm text-amber-700" role="status">
          {warning}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface/70 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Hostname</th>
                <th className="px-4 py-3 font-medium">Submitted as</th>
                <th className="px-4 py-3 font-medium">Requested</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Loading requests...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No pending requests.
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission.id} className="align-middle">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {submission.hostname}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-muted-foreground">
                      {submission.raw_input}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {new Date(submission.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={reviewingId === submission.id}
                          onClick={() =>
                            void reviewSubmission(submission, "approve")
                          }
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15 disabled:opacity-60"
                        >
                          <Check size={14} />
                          Block
                        </button>
                        <button
                          type="button"
                          disabled={reviewingId === submission.id}
                          onClick={() =>
                            void reviewSubmission(submission, "reject")
                          }
                          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-surface hover:text-foreground disabled:opacity-60"
                        >
                          <X size={14} />
                          Dismiss
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
