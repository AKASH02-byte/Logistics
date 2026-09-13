import { cookies } from "next/headers";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { verifyLoginKey } from "@/lib/auth/labour-credentials";
import {
  createLabourSessionToken,
  LABOUR_SESSION_COOKIE,
  labourSessionCookieOptions,
} from "@/lib/auth/labour-session";
import { labourLoginSchema } from "@/lib/validation/labour-auth";
import { jsonOk, jsonError, toErrorResponse } from "@/lib/api/response";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(request: Request) {
  try {
    const body = labourLoginSchema.parse(await request.json());
    const supabase = createSupabaseServiceRoleClient();

    const { data: labour, error: labourError } = await supabase
      .from("labours")
      .select("id, labour_code, status")
      .eq("labour_code", body.labourId.toUpperCase())
      .is("deleted_at", null)
      .maybeSingle();

    // Same generic error whether the Labour ID doesn't exist or the key is
    // wrong — never reveal which one to an unauthenticated caller.
    const genericError = () =>
      jsonError(401, "INVALID_CREDENTIALS", "Labour ID or Login Key is incorrect");

    if (labourError || !labour) return genericError();
    if (labour.status !== "ACTIVE") {
      return jsonError(403, "ACCOUNT_INACTIVE", "This account is not active");
    }

    const { data: credentials } = await supabase
      .from("labour_credentials")
      .select("login_key_hash, failed_attempts, locked_until")
      .eq("labour_id", labour.id)
      .maybeSingle();

    if (!credentials) return genericError();

    if (credentials.locked_until && new Date(credentials.locked_until) > new Date()) {
      return jsonError(
        423,
        "ACCOUNT_LOCKED",
        `Too many failed attempts. Try again after ${new Date(
          credentials.locked_until
        ).toLocaleTimeString("en-IN")}.`
      );
    }

    const valid = await verifyLoginKey(body.loginKey, credentials.login_key_hash);

    if (!valid) {
      const failedAttempts = credentials.failed_attempts + 1;
      const lockingOut = failedAttempts >= MAX_FAILED_ATTEMPTS;

      await supabase
        .from("labour_credentials")
        .update({
          failed_attempts: lockingOut ? 0 : failedAttempts,
          locked_until: lockingOut
            ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
            : null,
        })
        .eq("labour_id", labour.id);

      return genericError();
    }

    await supabase
      .from("labour_credentials")
      .update({ failed_attempts: 0, locked_until: null })
      .eq("labour_id", labour.id);

    await supabase.from("audit_logs").insert({
      actor_labour_id: labour.id,
      action: "LOGIN",
      entity_type: "labour",
      entity_id: labour.id,
    });

    const token = createLabourSessionToken(labour.id, labour.labour_code);
    const cookieStore = await cookies();
    cookieStore.set(LABOUR_SESSION_COOKIE, token, labourSessionCookieOptions);

    return jsonOk({ labourId: labour.id, labourCode: labour.labour_code });
  } catch (err) {
    return toErrorResponse(err);
  }
}
