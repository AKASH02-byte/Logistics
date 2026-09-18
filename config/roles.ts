export const APP_ROLES = [
  "SUPER_ADMIN",
  "STAFF",
] as const;

export type AppRole = (typeof APP_ROLES)[number];
