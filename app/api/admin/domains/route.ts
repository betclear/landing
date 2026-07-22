import { NextResponse } from "next/server";
import { scheduleAdGuardRefresh } from "@/lib/adguard/client";
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
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(
      200,
      Math.max(1, Number(searchParams.get("pageSize") ?? "100") || 100),
    );
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = createServiceClient();
    let query = supabase
      .from("blocked_domains")
      .select("id, hostname, category, enabled, created_at, updated_at", {
        count: "exact",
      })
      .order("hostname", { ascending: true })
      .range(from, to);

    if (q) {
      query = query.ilike("hostname", `%${q}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("domains list failed", error);
      return NextResponse.json(
        { error: "Failed to load domains" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      domains: data ?? [],
      page,
      pageSize,
      total: count ?? 0,
    });
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

    scheduleAdGuardRefresh();

    return NextResponse.json(
      {
        domain: data,
        dnsRefresh: true,
        refreshWarning: null,
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
