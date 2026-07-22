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
    const body = (await request.json()) as {
      enabled?: boolean;
      category?: string;
    };

    const updates: { enabled?: boolean; category?: string } = {};
    if (typeof body.enabled === "boolean") {
      updates.enabled = body.enabled;
    }
    if (typeof body.category === "string" && body.category.trim()) {
      updates.category = body.category.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("blocked_domains")
      .update(updates)
      .eq("id", id)
      .select("id, hostname, category, enabled, created_at, updated_at")
      .single();

    if (error) {
      console.error("domains patch failed", error);
      return NextResponse.json(
        { error: "Failed to update domain" },
        { status: 500 },
      );
    }

    scheduleAdGuardRefresh();

    return NextResponse.json({
      domain: data,
      dnsRefresh: true,
      refreshWarning: null,
    });
  } catch (error) {
    console.error("domains PATCH error", error);
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return unauthorized();
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("blocked_domains")
      .delete()
      .eq("id", id)
      .select("id, hostname")
      .maybeSingle();

    if (error) {
      console.error("domains delete failed", error);
      return NextResponse.json(
        { error: "Failed to delete domain" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 },
      );
    }

    scheduleAdGuardRefresh();

    return NextResponse.json({
      ok: true,
      deleted: data,
      dnsRefresh: true,
      refreshWarning: null,
    });
  } catch (error) {
    console.error("domains DELETE error", error);
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
}
