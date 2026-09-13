import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

/**
 * Browser-side Supabase client. Uses the anon key only — never the service
 * role key, which must never reach client code.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
}
