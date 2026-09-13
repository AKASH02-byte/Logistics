import { signPayload, verifyPayload } from "./session-token";
import { getSessionSecret } from "./session-secret";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // one working day

export interface AdminSessionPayload {
  adminId: string;
  issuedAt: number;
  expiresAt: number;
}

export function createAdminSessionToken(adminId: string): string {
  return signPayload(getSessionSecret(), { adminId }, SESSION_TTL_SECONDS);
}

export function verifyAdminSessionToken(token: string): AdminSessionPayload | null {
  return verifyPayload<AdminSessionPayload>(getSessionSecret(), token);
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
