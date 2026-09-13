import { createHmac, timingSafeEqual } from "node:crypto";

export function signPayload(secret: string, payload: object, ttlSeconds: number): string {
  const now = Date.now();
  const full = { ...payload, issuedAt: now, expiresAt: now + ttlSeconds * 1000 };
  const payloadB64 = Buffer.from(JSON.stringify(full)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifyPayload<T extends { expiresAt: number }>(
  secret: string,
  token: string
): T | null {
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expected = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as T;
    if (typeof payload.expiresAt !== "number" || payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
