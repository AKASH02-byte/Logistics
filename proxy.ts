import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { LABOUR_SESSION_COOKIE } from "@/lib/auth/labour-session-constants";

/**
 * Cheap routing split only — checks for the presence of a session cookie,
 * not its validity or the identity behind it. Real verification happens in
 * the (admin)/(driver) layouts, which can do the async lookup. See
 * docs/ROUTES.md.
 *
 * DEMO MODE note: this also replaces the Supabase session-refresh logic
 * that would normally live here (see docs/ARCHITECTURE.md) since admin
 * auth is currently the hardcoded lib/demo/store.ts account rather than
 * Supabase Auth.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/driver") && !request.cookies.has(LABOUR_SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/driver/:path*"],
};
