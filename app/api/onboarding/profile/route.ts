import { NextResponse } from "next/server";
import { upsertRecoveryProfile } from "@/lib/onboarding/profile";
import type { OnboardingPersistPayload } from "@/lib/onboarding/types";
import { isPlanId } from "@/lib/stripe/prices";
import { getAuthenticatedUser } from "@/lib/supabase/server-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parsePayload(body: unknown): OnboardingPersistPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const currency =
    typeof data.currency === "string" ? data.currency.toUpperCase() : null;
  const monthlyGamblingSpend = Number(data.monthlyGamblingSpend);
  const weeklyGamblingHours = Number(data.weeklyGamblingHours);
  const lastGamblingDate =
    data.lastGamblingDate === null
      ? null
      : typeof data.lastGamblingDate === "string"
        ? data.lastGamblingDate
        : undefined;
  const lastGamblingDateIsApproximate = Boolean(
    data.lastGamblingDateIsApproximate,
  );
  const selectedPlan = data.selectedPlan;

  if (!currency || currency.length !== 3) return null;
  if (!Number.isFinite(monthlyGamblingSpend) || monthlyGamblingSpend <= 0) {
    return null;
  }
  if (!Number.isFinite(weeklyGamblingHours) || weeklyGamblingHours <= 0) {
    return null;
  }
  if (lastGamblingDate === undefined) return null;
  if (!isPlanId(selectedPlan)) return null;
  if (
    lastGamblingDate !== null &&
    !/^\d{4}-\d{2}-\d{2}$/.test(lastGamblingDate)
  ) {
    return null;
  }

  return {
    currency,
    monthlyGamblingSpend,
    weeklyGamblingHours,
    lastGamblingDate,
    lastGamblingDateIsApproximate,
    selectedPlan,
  };
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  try {
    const profile = await upsertRecoveryProfile(user.id, payload);
    return NextResponse.json({
      ok: true,
      selectedPlan: profile.selected_plan,
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "save_failed"
        : error instanceof Error
          ? error.message
          : "save_failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
