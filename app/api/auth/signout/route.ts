import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server-auth";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("sign out error", error);
    return NextResponse.json({ error: "Unable to sign out" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
