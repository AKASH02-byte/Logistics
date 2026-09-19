import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import type { PermissionCode } from "@/config/permissions";
import type { UserRow } from "@/types/database";
import { UnauthorizedError, ForbiddenError } from "./errors";

export async function resolveAdminIdentity(): Promise<UserRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    console.error("Admin identity lookup: no Supabase Auth user");
    return null;
  }

  const serviceSupabase = createSupabaseServiceRoleClient();
  const { data, error } = await serviceSupabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authUser.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    console.error("Admin identity lookup failed:", error?.message ?? "No users row returned");
    return null;
  }

  return data as UserRow;
}

export async function roleHasPermission(
  role: UserRow["role"],
  code: PermissionCode
): Promise<boolean> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("role_permissions")
    .select("permissions!inner(code)")
    .eq("role", role)
    .eq("permissions.code", code)
    .maybeSingle();

  return !error && !!data;
}

export async function requirePermission(code: PermissionCode): Promise<UserRow> {
  const identity = await resolveAdminIdentity();
  if (!identity) throw new UnauthorizedError();
  if (identity.status !== "ACTIVE") throw new ForbiddenError("Account is not active");

  if (!(await roleHasPermission(identity.role, code))) {
    throw new ForbiddenError();
  }

  return identity;
}
