import { cookies } from "next/headers";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { LABOUR_SESSION_COOKIE, verifyLabourSessionToken } from "@/lib/auth/labour-session";
import type { LabourRow } from "@/types/database";
import { UnauthorizedError } from "./errors";

export async function requireLabourSession(): Promise<LabourRow> {
  const cookieStore = await cookies();
  const token = cookieStore.get(LABOUR_SESSION_COOKIE)?.value;
  if (!token) throw new UnauthorizedError();

  const payload = verifyLabourSessionToken(token);
  if (!payload) throw new UnauthorizedError();

  const supabase = createSupabaseServiceRoleClient();
  const { data: labour, error } = await supabase
    .from("labours")
    .select("*")
    .eq("id", payload.labourId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !labour || labour.status !== "ACTIVE") {
    throw new UnauthorizedError("Labour account is not active");
  }

  return labour as LabourRow;
}
