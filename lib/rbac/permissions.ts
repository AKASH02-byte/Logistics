import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PermissionCode } from "@/config/permissions";
import type { UserRow } from "@/types/database";
import { UnauthorizedError, ForbiddenError } from "./errors";

/**
 * Resolves the calling admin/staff identity from the Supabase Auth session
 * on the current request. Returns null if there is no session, or if the
 * session exists but has no corresponding active `users` row (e.g. an
 * INVITED account still awaiting Super Admin bootstrap/role assignment).
 */
export async function resolveAdminIdentity(): Promise<UserRow | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authUser.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) return null;
  return data as UserRow;
}

/**
 * Checks whether a role has a given permission. Delegates to the same
 * role_permissions table that backs the RLS policies (0003_rls.sql) — this
 * function is the application-code mirror of the `has_permission()` SQL
 * function, not an independent decision.
 */
export async function roleHasPermission(
  role: UserRow["role"],
  code: PermissionCode
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("role_permissions")
    .select("permissions!inner(code)")
    .eq("role", role)
    .eq("permissions.code", code)
    .maybeSingle();

  return !error && !!data;
}

/**
 * Call at the top of every admin API route handler before touching data.
 * Throws UnauthorizedError (no session / no linked user) or ForbiddenError
 * (session valid, permission not granted to this role) — callers should map
 * these to 401/403 JSON responses. Never bypass this with a role-name
 * string comparison; see docs/RBAC.md.
 */
export async function requirePermission(code: PermissionCode): Promise<UserRow> {
  const identity = await resolveAdminIdentity();
  if (!identity) throw new UnauthorizedError();
  if (identity.status !== "ACTIVE") {
    throw new ForbiddenError("Account is not active");
  }

  const allowed = await roleHasPermission(identity.role, code);
  if (!allowed) throw new ForbiddenError();

  return identity;
}
