import { NextResponse } from "next/server";
import { scheduleAdGuardRefresh } from "@/lib/adguard/client";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return unauthorized();
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as { action?: string };
    const action = body.action;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Action must be approve or reject" },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();
    const { data: submission, error: loadError } = await supabase
      .from("domain_submissions")
      .select("id, hostname, raw_input, status, created_at, reviewed_at")
      .eq("id", id)
      .single();

    if (loadError || !submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.status !== "pending") {
      return NextResponse.json(
        { error: "Submission already reviewed" },
        { status: 409 },
      );
    }

    if (action === "approve") {
      const { error: insertError } = await supabase
        .from("blocked_domains")
        .insert({
          hostname: submission.hostname,
          category: "gambling",
          enabled: true,
        });

      if (insertError && insertError.code !== "23505") {
        console.error("approve insert blocked_domains failed", insertError);
        return NextResponse.json(
          { error: "Failed to block domain" },
          { status: 500 },
        );
      }

      scheduleAdGuardRefresh();
    }

    const nextStatus = action === "approve" ? "approved" : "rejected";
    const { data: updated, error: updateError } = await supabase
      .from("domain_submissions")
      .update({
        status: nextStatus,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, hostname, raw_input, status, created_at, reviewed_at")
      .single();

    if (updateError) {
      console.error("submission review update failed", updateError);
      return NextResponse.json(
        { error: "Failed to update submission" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      submission: updated,
      dnsRefresh: action === "approve",
      refreshWarning: null,
    });
  } catch (error) {
    console.error("submissions PATCH error", error);
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
}
