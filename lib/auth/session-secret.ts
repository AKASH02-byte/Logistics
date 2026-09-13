const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-do-not-use-in-production";

/**
 * Falls back to a fixed dev secret when SESSION_SECRET isn't set, so the
 * demo app runs with zero .env setup. Never falls back in production.
 */
export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing required environment variable: SESSION_SECRET");
  }

  return DEV_FALLBACK_SECRET;
}
