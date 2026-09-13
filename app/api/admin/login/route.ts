import { cookies } from "next/headers";
import { demoStore } from "@/lib/demo/store";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/auth/admin-session";
import { adminLoginSchema } from "@/lib/validation/admin-auth";
import { jsonOk, jsonError, toErrorResponse } from "@/lib/api/response";

/**
 * DEMO MODE: checks against the single hardcoded admin account in
 * lib/demo/store.ts instead of Supabase Auth / Google OAuth. See
 * docs/DEVELOPMENT_PLAN.md for the note on reverting this.
 */
export async function POST(request: Request) {
  try {
    const body = adminLoginSchema.parse(await request.json());
    const { admin } = demoStore;

    if (body.adminId !== admin.adminId || body.password !== admin.password) {
      return jsonError(401, "INVALID_CREDENTIALS", "Admin ID or password is incorrect");
    }

    const token = createAdminSessionToken(admin.adminId);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions);

    return jsonOk({ adminId: admin.adminId });
  } catch (err) {
    return toErrorResponse(err);
  }
}
