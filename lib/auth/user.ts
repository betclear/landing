import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server-auth";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import type { AppLocale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";

export async function getAuthUser(): Promise<User | null> {
  if (!isSupabaseAuthConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuthUser(
  nextPath: string,
  locale?: AppLocale,
): Promise<User> {
  const user = await getAuthUser();
  if (!user) {
    const loginBase = locale ? localizePath(locale, "/login") : "/login";
    redirect(`${loginBase}?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}
