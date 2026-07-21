"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";

type AuthUserState = {
  user: User | null;
  loading: boolean;
};

export function useAuthUser(): AuthUserState {
  const [state, setState] = useState<AuthUserState>({
    user: null,
    loading: isSupabaseAuthConfigured(),
  });

  useEffect(() => {
    if (!isSupabaseAuthConfigured()) return;

    const supabase = createBrowserSupabaseClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setState({ user: data.user ?? null, loading: false });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function signOutUser(): Promise<void> {
  if (isSupabaseAuthConfigured()) {
    await createBrowserSupabaseClient().auth.signOut();
  }
  await fetch("/api/auth/signout", { method: "POST" });
}
