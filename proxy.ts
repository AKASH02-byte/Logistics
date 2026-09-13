import { NextResponse, type NextRequest } from "next/server";
import { LABOUR_SESSION_COOKIE } from "@/lib/auth/labour-session-constants";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/admin-session";

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
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !request.cookies.has(ADMIN_SESSION_COOKIE)) {
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
