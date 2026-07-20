import { NextResponse } from "next/server";
import { refreshAdGuardBlocklist } from "@/lib/adguard/client";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { normalizeHostname } from "@/lib/domains/normalize";
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
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();

    const supabase = createServiceClient();
    let query = supabase
      .from("blocked_domains")
      .select("id, hostname, category, enabled, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.ilike("hostname", `%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("domains list failed", error);
      return NextResponse.json(
        { error: "Failed to load domains" },
        { status: 500 },
      );
    }

    return NextResponse.json({ domains: data ?? [] });
  } catch (error) {
    console.error("domains GET error", error);
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return unauthorized();
  }

  try {
    const body = (await request.json()) as {
      hostname?: string;
      category?: string;
    };

    const hostname = normalizeHostname(body.hostname ?? "");
    if (!hostname) {
      return NextResponse.json(
        { error: "Invalid hostname" },
        { status: 400 },
      );
    }

    const category = (body.category ?? "gambling").trim() || "gambling";
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("blocked_domains")
      .insert({ hostname, category, enabled: true })
      .select("id, hostname, category, enabled, created_at, updated_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Domain already exists" },
          { status: 409 },
        );
      }
      console.error("domains insert failed", error);
      return NextResponse.json(
        { error: "Failed to add domain" },
        { status: 500 },
      );
    }

    const refresh = await refreshAdGuardBlocklist();

    return NextResponse.json(
      {
        domain: data,
        dnsRefresh: refresh.ok,
        refreshWarning: refresh.warning ?? null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("domains POST error", error);
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
}
