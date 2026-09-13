import { createHmac, timingSafeEqual } from "node:crypto";

export { LABOUR_SESSION_COOKIE } from "./labour-session-constants";
const SESSION_TTL_SECONDS = 60 * 60 * 16; // one working shift

export interface LabourSessionPayload {
  labourId: string;
  labourCode: string;
  issuedAt: number;
  expiresAt: number;
}

function getSecret(): string {
  const secret = process.env.LABOUR_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing required environment variable: LABOUR_SESSION_SECRET");
  }
  return secret;
}

function sign(payloadB64: string): string {
  return createHmac("sha256", getSecret()).update(payloadB64).digest("base64url");
}

export function createLabourSessionToken(labourId: string, labourCode: string): string {
  const now = Date.now();
  const payload: LabourSessionPayload = {
    labourId,
    labourCode,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(payloadB64);
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a labour session token's signature and expiry. Returns the
 * payload if valid, otherwise null. Callers must still confirm the
 * labour_id in the payload still refers to an ACTIVE labour before trusting
 * it for authorization decisions (a labour can be deactivated mid-shift).
 */
export function verifyLabourSessionToken(token: string): LabourSessionPayload | null {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSignature = sign(payloadB64);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as LabourSessionPayload;
    if (typeof payload.expiresAt !== "number" || payload.expiresAt < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export const labourSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
