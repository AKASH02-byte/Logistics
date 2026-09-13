import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase OAuth callback (admin/staff surface). Exchanges the auth code
 * for a session, then ensures a corresponding `users` row exists — with NO
 * role granted by default. Role assignment happens via the bootstrap script
 * (first Super Admin) or an existing admin, never automatically here.
 * See docs/SETUP_ADMIN.md.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("users").insert({
          auth_user_id: data.user.id,
          full_name: data.user.user_metadata?.full_name ?? data.user.email ?? "New user",
          email: data.user.email,
          role: "STAFF",
          status: "INVITED",
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
