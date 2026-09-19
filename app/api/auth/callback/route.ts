import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { supabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/dashboard";

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);
    const supabase = createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
      cookies: {
        getAll: () => request.headers.get("cookie")
          ? request.headers.get("cookie")!.split("; ").map((part) => {
              const [name, ...value] = part.split("=");
              return { name, value: value.join("=") };
            })
          : [],
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const serviceSupabase = createSupabaseServiceRoleClient();
      const { data: existing } = await serviceSupabase
        .from("users")
        .select("id")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      if (!existing) {
        const { error: insertError } = await serviceSupabase.from("users").insert({
          auth_user_id: data.user.id,
          full_name: data.user.user_metadata?.full_name ?? data.user.email ?? "New user",
          email: data.user.email,
          role: "STAFF",
          status: "INVITED",
        });
        if (insertError) {
          console.error("Failed to create application user:", insertError.message);
          return NextResponse.redirect(`${origin}/login?error=profile_creation_failed`);
        }
      }

      return response;
    }

    console.error("Supabase OAuth callback failed:", error?.message ?? "No user returned");
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
