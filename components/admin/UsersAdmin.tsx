"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { AdminRegisteredUser } from "@/lib/supabase/types";

const PAGE_SIZE = 50;

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function formatDateOnly(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function formatNumber(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toLocaleString();
}

function cell(value: string | number | boolean | null | undefined) {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

const COLUMNS: Array<{
  key: keyof AdminRegisteredUser | "providers_display";
  label: string;
  render: (user: AdminRegisteredUser) => string;
}> = [
  { key: "id", label: "User ID", render: (u) => cell(u.id) },
  { key: "email", label: "Email", render: (u) => cell(u.email) },
  {
    key: "email_confirmed_at",
    label: "Email confirmed",
    render: (u) => formatDate(u.email_confirmed_at),
  },
  {
    key: "last_sign_in_at",
    label: "Last sign-in",
    render: (u) => formatDate(u.last_sign_in_at),
  },
  {
    key: "created_at",
    label: "Registered",
    render: (u) => formatDate(u.created_at),
  },
  {
    key: "providers_display",
    label: "Providers",
    render: (u) => (u.providers.length ? u.providers.join(", ") : "—"),
  },
  {
    key: "subscription_id",
    label: "Subscription ID",
    render: (u) => cell(u.subscription_id),
  },
  {
    key: "stripe_customer_id",
    label: "Stripe customer",
    render: (u) => cell(u.stripe_customer_id),
  },
  {
    key: "stripe_subscription_id",
    label: "Stripe subscription",
    render: (u) => cell(u.stripe_subscription_id),
  },
  {
    key: "subscription_email",
    label: "Subscription email",
    render: (u) => cell(u.subscription_email),
  },
  {
    key: "subscription_status",
    label: "Status",
    render: (u) => cell(u.subscription_status),
  },
  { key: "price_id", label: "Price ID", render: (u) => cell(u.price_id) },
  { key: "plan", label: "Plan", render: (u) => cell(u.plan) },
  {
    key: "current_period_end",
    label: "Period end",
    render: (u) => formatDate(u.current_period_end),
  },
  {
    key: "is_premium",
    label: "Premium",
    render: (u) => cell(u.is_premium),
  },
  {
    key: "subscription_created_at",
    label: "Sub created",
    render: (u) => formatDate(u.subscription_created_at),
  },
  {
    key: "subscription_updated_at",
    label: "Sub updated",
    render: (u) => formatDate(u.subscription_updated_at),
  },
  {
    key: "profile_id",
    label: "Profile ID",
    render: (u) => cell(u.profile_id),
  },
  { key: "currency", label: "Currency", render: (u) => cell(u.currency) },
  {
    key: "monthly_gambling_spend",
    label: "Monthly spend",
    render: (u) => formatNumber(u.monthly_gambling_spend),
  },
  {
    key: "weekly_gambling_hours",
    label: "Weekly hours",
    render: (u) => formatNumber(u.weekly_gambling_hours),
  },
  {
    key: "last_gambling_date",
    label: "Last gamble",
    render: (u) => formatDateOnly(u.last_gambling_date),
  },
  {
    key: "last_gambling_date_is_approximate",
    label: "Last gamble approx",
    render: (u) => cell(u.last_gambling_date_is_approximate),
  },
  {
    key: "onboarding_completed_at",
    label: "Onboarding done",
    render: (u) => formatDate(u.onboarding_completed_at),
  },
  {
    key: "selected_plan",
    label: "Selected plan",
    render: (u) => cell(u.selected_plan),
  },
  {
    key: "profile_stripe_customer_id",
    label: "Profile Stripe customer",
    render: (u) => cell(u.profile_stripe_customer_id),
  },
  {
    key: "profile_stripe_subscription_id",
    label: "Profile Stripe sub",
    render: (u) => cell(u.profile_stripe_subscription_id),
  },
  {
    key: "profile_subscription_status",
    label: "Profile status",
    render: (u) => cell(u.profile_subscription_status),
  },
  {
    key: "trial_ends_at",
    label: "Trial ends",
    render: (u) => formatDate(u.trial_ends_at),
  },
  {
    key: "current_period_ends_at",
    label: "Profile period end",
    render: (u) => formatDate(u.current_period_ends_at),
  },
  {
    key: "profile_created_at",
    label: "Profile created",
    render: (u) => formatDate(u.profile_created_at),
  },
  {
    key: "profile_updated_at",
    label: "Profile updated",
    render: (u) => formatDate(u.profile_updated_at),
  },
];

export function UsersAdmin() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminRegisteredUser[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(
    async (search = query, nextPage = page) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      params.set("page", String(nextPage));
      params.set("pageSize", String(PAGE_SIZE));

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      const data = (await response.json()) as {
        users?: AdminRegisteredUser[];
        total?: number;
        page?: number;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Failed to load users");
        setLoading(false);
        return;
      }

      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
      setPage(data.page ?? nextPage);
      setLoading(false);
    },
    [query, page, router],
  );

  useEffect(() => {
    void loadUsers("", 1);
    // Initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Container>
      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
          Registered users
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {total.toLocaleString()} users from Auth, with subscriptions and
          recovery profile columns. Showing page {page} of {totalPages}.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            placeholder="Search email, user id, Stripe id, plan…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void loadUsers(query, 1);
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
          onClick={() => void loadUsers(query, 1)}
        >
          Search
        </Button>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface/70 text-muted-foreground">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    className="whitespace-nowrap px-4 py-3 font-medium"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No registered users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="align-middle">
                    {COLUMNS.map((column) => (
                      <td
                        key={column.key}
                        className={
                          column.key === "email"
                            ? "whitespace-nowrap px-4 py-3 font-medium text-foreground"
                            : "whitespace-nowrap px-4 py-3 tabular-nums text-muted-foreground"
                        }
                      >
                        {column.key === "is_premium" ? (
                          <span
                            className={
                              user.is_premium
                                ? "inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                                : "inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            }
                          >
                            {user.is_premium == null
                              ? "—"
                              : user.is_premium
                                ? "Premium"
                                : "No"}
                          </span>
                        ) : column.key === "subscription_status" &&
                          user.subscription_status ? (
                          <span className="inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-foreground">
                            {user.subscription_status}
                          </span>
                        ) : (
                          column.render(user)
                        )}
                      </td>
                    ))}
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
          onClick={() => void loadUsers(query, page - 1)}
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
          onClick={() => void loadUsers(query, page + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}
