import { cookies } from "next/headers";
import { LABOUR_SESSION_COOKIE, verifyLabourSessionToken } from "@/lib/auth/labour-session";
import { findLabourById } from "@/lib/demo/store";
import type { LabourRow } from "@/types/database";
import { UnauthorizedError } from "./errors";

/**
 * DEMO MODE: looks up the labour in the hardcoded in-memory store instead
 * of Supabase. See lib/demo/store.ts.
 */
export async function requireLabourSession(): Promise<LabourRow> {
  const cookieStore = await cookies();
  const token = cookieStore.get(LABOUR_SESSION_COOKIE)?.value;
  if (!token) throw new UnauthorizedError();

  const payload = verifyLabourSessionToken(token);
  if (!payload) throw new UnauthorizedError();

  const labour = findLabourById(payload.labourId);
  if (!labour || labour.status !== "ACTIVE") {
    throw new UnauthorizedError("Labour account is not active");
  }

  return {
    id: labour.id,
    labour_code: labour.labourCode,
    full_name: labour.fullName,
    phone: labour.phone,
    address: null,
    licence_number: null,
    licence_expiry: null,
    joining_date: "",
    language: "en",
    status: labour.status,
    photo_url: null,
    created_by: null,
    created_at: "",
    updated_at: "",
    deleted_at: null,
  };
}
