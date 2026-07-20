"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, SignOut, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { BlockedDomain } from "@/lib/supabase/types";

const PAGE_SIZE = 100;

export function DomainsAdmin() {
  const router = useRouter();
  const [domains, setDomains] = useState<BlockedDomain[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hostname, setHostname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function applyRefreshWarning(data: { refreshWarning?: string | null }) {
    setWarning(data.refreshWarning ?? null);
  }

  const loadDomains = useCallback(
    async (search = query, nextPage = page) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      params.set("page", String(nextPage));
      params.set("pageSize", String(PAGE_SIZE));

      const response = await fetch(`/api/admin/domains?${params.toString()}`);
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const data = (await response.json()) as {
        domains?: BlockedDomain[];
        total?: number;
        page?: number;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Failed to load domains");
        setLoading(false);
        return;
      }

      setDomains(data.domains ?? []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? nextPage);
      setLoading(false);
    },
    [query, page, router],
  );

  useEffect(() => {
    void loadDomains("", 1);
    // Initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function onAdd(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setWarning(null);

    const response = await fetch("/api/admin/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostname }),
    });

    const data = (await response.json()) as {
      domain?: BlockedDomain;
      error?: string;
      refreshWarning?: string | null;
    };

    if (!response.ok) {
      setError(data.error ?? "Failed to add domain");
      setSaving(false);
      return;
    }

    applyRefreshWarning(data);
    setHostname("");
    setSaving(false);
    await loadDomains(query, 1);
  }

  async function toggleEnabled(domain: BlockedDomain) {
    setError(null);
    setWarning(null);
    const response = await fetch(`/api/admin/domains/${domain.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !domain.enabled }),
    });

    const data = (await response.json()) as {
      error?: string;
      refreshWarning?: string | null;
    };

    if (!response.ok) {
      setError(data.error ?? "Failed to update domain");
      return;
    }

    applyRefreshWarning(data);
    await loadDomains(query, page);
  }

  async function removeDomain(domain: BlockedDomain) {
    if (!window.confirm(`Delete ${domain.hostname}?`)) return;

    setError(null);
    setWarning(null);
    const response = await fetch(`/api/admin/domains/${domain.id}`, {
      method: "DELETE",
    });

    const data = (await response.json()) as {
      error?: string;
      refreshWarning?: string | null;
    };

    if (!response.ok) {
      setError(data.error ?? "Failed to delete domain");
      return;
    }

    applyRefreshWarning(data);
    await loadDomains(query, page);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-foreground">
            Blocked domains
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {total.toLocaleString()} domains in Supabase. Showing page {page} of{" "}
            {totalPages}. Use search to find hosts.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          showArrow={false}
          onClick={() => void logout()}
          className="self-start sm:self-auto"
        >
          <SignOut size={16} />
          Sign out
        </Button>
      </div>

      <form
        onSubmit={onAdd}
        className="mt-8 flex flex-col gap-3 rounded-[var(--radius-xl)] border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-2">
          <label
            htmlFor="hostname"
            className="block text-sm font-medium text-foreground"
          >
            Add domain
          </label>
          <input
            id="hostname"
            name="hostname"
            placeholder="https://www.bet365.com/sports"
            value={hostname}
            onChange={(event) => setHostname(event.target.value)}
            className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
            required
          />
        </div>
        <Button
          type="submit"
          size="md"
          showArrow={false}
          disabled={saving || !hostname.trim()}
        >
          {saving ? "Adding..." : "Add"}
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search domains"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void loadDomains(query, 1);
              }
            }}
            className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-card pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          showArrow={false}
          onClick={() => void loadDomains(query, 1)}
        >
          Search
        </Button>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {warning ? (
        <p
          className="mt-4 text-sm text-amber-700"
          role="status"
        >
          {warning}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface/70 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Hostname</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Loading domains...
                  </td>
                </tr>
              ) : domains.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No domains on this page. Import the pipeline list or add one.
                  </td>
                </tr>
              ) : (
                domains.map((domain) => (
                  <tr key={domain.id} className="align-middle">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {domain.hostname}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {domain.category}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          domain.enabled
                            ? "inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                            : "inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {domain.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {new Date(domain.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void toggleEnabled(domain)}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface"
                        >
                          {domain.enabled ? "Disable" : "Enable"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void removeDomain(domain)}
                          aria-label={`Delete ${domain.hostname}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-surface hover:text-foreground"
                        >
                          <Trash size={14} />
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

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          size="md"
          showArrow={false}
          disabled={page <= 1 || loading}
          onClick={() => void loadDomains(query, page - 1)}
        >
          Previous
        </Button>
        <p className="text-sm text-muted-foreground">
          Page {page} / {totalPages}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          showArrow={false}
          disabled={page >= totalPages || loading}
          onClick={() => void loadDomains(query, page + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}
