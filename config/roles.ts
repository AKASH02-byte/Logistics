export const APP_ROLES = [
  "SUPER_ADMIN",
  "BUSINESS_OWNER",
  "MANAGER",
  "ACCOUNTANT",
  "FLEET_MANAGER",
  "PROJECT_MANAGER",
  "STAFF",
  "LABOUR",
] as const;

export type AppRole = (typeof APP_ROLES)[number];
