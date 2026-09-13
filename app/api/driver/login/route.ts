import { cookies } from "next/headers";
import { findLabourByCode } from "@/lib/demo/store";
import {
  createLabourSessionToken,
  LABOUR_SESSION_COOKIE,
  labourSessionCookieOptions,
} from "@/lib/auth/labour-session";
import { labourLoginSchema } from "@/lib/validation/labour-auth";
import { jsonOk, jsonError, toErrorResponse } from "@/lib/api/response";

/**
 * DEMO MODE: checks against the hardcoded labour list in lib/demo/store.ts
 * instead of a `labours`/`labour_credentials` table. Login keys are stored
 * in plain text there for this demo only — the real design (docs/RBAC.md)
 * hashes them and never compares plaintext.
 */
export async function POST(request: Request) {
  try {
    const body = labourLoginSchema.parse(await request.json());
    const labour = findLabourByCode(body.labourId);

    const genericError = () =>
      jsonError(401, "INVALID_CREDENTIALS", "Labour ID or Login Key is incorrect");

    if (!labour) return genericError();
    if (labour.status !== "ACTIVE") {
      return jsonError(403, "ACCOUNT_INACTIVE", "This account is not active");
    }
    if (labour.loginKey !== body.loginKey.toUpperCase()) return genericError();

    const token = createLabourSessionToken(labour.id, labour.labourCode);
    const cookieStore = await cookies();
    cookieStore.set(LABOUR_SESSION_COOKIE, token, labourSessionCookieOptions);

    return jsonOk({ labourId: labour.id, labourCode: labour.labourCode });
  } catch (err) {
    return toErrorResponse(err);
  }
}
