import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Middleware refreshes the session during Server Component renders.
        }
      },
    },
  });
}

export function createSupabaseServiceRoleClient() {
  return createServerClient(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // Service-role clients never manage browser session cookies.
      },
    },
  });
}
