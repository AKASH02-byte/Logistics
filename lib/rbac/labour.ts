import { cookies } from "next/headers";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { LABOUR_SESSION_COOKIE, verifyLabourSessionToken } from "@/lib/auth/labour-session";
import type { LabourRow } from "@/types/database";
import { UnauthorizedError } from "./errors";

/**
 * Call at the top of every driver API route handler. Verifies the signed
 * session cookie, then re-checks the labour is still ACTIVE in the
 * database (a labour can be deactivated mid-shift by an admin). Returns the
 * current LabourRow — callers must scope every subsequent query to
 * `labour.id` themselves; this function does not know which resource is
 * being accessed.
 */
export async function requireLabourSession(): Promise<LabourRow> {
  const cookieStore = await cookies();
  const token = cookieStore.get(LABOUR_SESSION_COOKIE)?.value;
  if (!token) throw new UnauthorizedError();

  const payload = verifyLabourSessionToken(token);
  if (!payload) throw new UnauthorizedError();

  // Service role client: labour sessions are not Supabase Auth sessions, so
  // there is no auth.uid() for RLS to key off. This route has already
  // authenticated the caller above — this lookup is scoped to exactly one
  // row by primary key, not an open-ended query.
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("labours")
    .select("*")
    .eq("id", payload.labourId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data || data.status !== "ACTIVE") {
    throw new UnauthorizedError("Labour account is not active");
  }

  return data as LabourRow;
}
