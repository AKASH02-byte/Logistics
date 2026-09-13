import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/**
 * Server-side Supabase client bound to the request's cookies, for use in
 * Server Components, Route Handlers, and Server Actions on the admin/staff
 * surface. Runs as the authenticated user (Supabase Auth session) — reads
 * and writes are subject to Row Level Security.
 */
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
          // Called from a Server Component render — the middleware is
          // responsible for refreshing the session in that case.
        }
      },
    },
  });
}

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely.
 * SERVER-ONLY: only for the labour-auth routes and admin-script contexts
 * documented in docs/RBAC.md, and always after the caller has already
 * performed its own authorization check.
 */
export function createSupabaseServiceRoleClient() {
  return createServerClient(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // Service role client never manages a browser session cookie.
      },
    },
  });
}
