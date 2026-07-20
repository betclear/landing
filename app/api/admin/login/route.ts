import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      ADMIN_COOKIE,
      createAdminSessionToken(),
      adminCookieOptions(),
    );
    return response;
  } catch (error) {
    console.error("admin login error", error);
    return NextResponse.json(
      { error: "Login is unavailable. Check ADMIN_PASSWORD." },
      { status: 500 },
    );
  }
}
