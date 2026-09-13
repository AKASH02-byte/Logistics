// Split out from labour-session.ts so Edge Runtime code (middleware.ts) can
// reference the cookie name without pulling in node:crypto, which Edge
// Runtime does not support.
export const LABOUR_SESSION_COOKIE = "labour_session";
