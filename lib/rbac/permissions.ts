import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth/admin-session";
import { demoStore } from "@/lib/demo/store";
import { UnauthorizedError, ForbiddenError } from "./errors";

export interface AdminIdentity {
  id: string;
  full_name: string;
  role: "SUPER_ADMIN";
  status: "ACTIVE";
}

/**
 * DEMO MODE: resolves the admin identity from the hardcoded admin session
 * cookie instead of a Supabase Auth session + `users` table lookup. There
 * is exactly one admin account (lib/demo/store.ts) with SUPER_ADMIN,
 * so every permission check below trivially passes for it. See the note at
 * the top of lib/demo/store.ts and docs/DEVELOPMENT_PLAN.md.
 */
export async function resolveAdminIdentity(): Promise<AdminIdentity | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyAdminSessionToken(token);
  if (!payload || payload.adminId !== demoStore.admin.adminId) return null;

  return {
    id: demoStore.admin.adminId,
    full_name: demoStore.admin.fullName,
    role: demoStore.admin.role,
    status: "ACTIVE",
  };
}

/**
 * The single hardcoded admin is SUPER_ADMIN and holds every permission.
 * Kept as an explicit function (rather than inlining `true`) so real
 * per-role permission checks (docs/RBAC.md) drop back in without touching
 * call sites once the database-backed identity returns.
 */
export async function roleHasPermission(): Promise<boolean> {
  return true;
}

export async function requirePermission(): Promise<AdminIdentity> {
  const identity = await resolveAdminIdentity();
  if (!identity) throw new UnauthorizedError();
  if (identity.status !== "ACTIVE") throw new ForbiddenError("Account is not active");
  return identity;
}
