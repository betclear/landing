import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorized();
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") ?? "pending").trim();
    const allowed = new Set(["pending", "approved", "rejected", "all"]);
    if (!allowed.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = createServiceClient();
    let query = supabase
      .from("domain_submissions")
      .select("id, hostname, raw_input, status, created_at, reviewed_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .limit(100);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("submissions list failed", error);
      return NextResponse.json(
        { error: "Failed to load submissions" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      submissions: data ?? [],
      total: count ?? 0,
    });
  } catch (error) {
    console.error("submissions GET error", error);
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
}
