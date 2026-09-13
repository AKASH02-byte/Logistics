import { signPayload, verifyPayload } from "./session-token";
import { getSessionSecret } from "./session-secret";

export { LABOUR_SESSION_COOKIE } from "./labour-session-constants";

const SESSION_TTL_SECONDS = 60 * 60 * 16; // one working shift

export interface LabourSessionPayload {
  labourId: string;
  labourCode: string;
  issuedAt: number;
  expiresAt: number;
}

export function createLabourSessionToken(labourId: string, labourCode: string): string {
  return signPayload(getSessionSecret(), { labourId, labourCode }, SESSION_TTL_SECONDS);
}

/**
 * Verifies a labour session token's signature and expiry. Returns the
 * payload if valid, otherwise null. Callers must still confirm the
 * labour_id in the payload still refers to an ACTIVE labour before trusting
 * it for authorization decisions (a labour can be deactivated mid-shift).
 */
export function verifyLabourSessionToken(token: string): LabourSessionPayload | null {
  return verifyPayload<LabourSessionPayload>(getSessionSecret(), token);
}

export const labourSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
