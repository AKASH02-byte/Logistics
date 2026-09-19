import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
}
