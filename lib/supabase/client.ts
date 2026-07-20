import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseAuthConfigured,
} from "@/lib/supabase/config";

let client: SupabaseClient | null = null;

export function createBrowserSupabaseClient(): SupabaseClient {
  if (!isSupabaseAuthConfigured()) {
    throw new Error("Supabase Auth is not configured");
  }

  if (!client) {
    client = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
  }

  return client;
}
