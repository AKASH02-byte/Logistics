/**
 * Permission code catalogue. Must stay in sync with
 * supabase/migrations/0002_permissions_seed.sql — this file exists so
 * TypeScript call sites get autocomplete/typo-checking on permission codes,
 * not as a second source of truth. The database row is what's actually
 * checked at runtime.
 */
export const PERMISSIONS = {
  TRUCKS_READ: "trucks.read",
  TRUCKS_CREATE: "trucks.create",
  TRUCKS_UPDATE: "trucks.update",
  TRUCKS_DELETE: "trucks.delete",

  DRIVERS_READ: "drivers.read",
  DRIVERS_CREATE: "drivers.create",
  DRIVERS_UPDATE: "drivers.update",
  DRIVERS_DELETE: "drivers.delete",

  SESSIONS_READ: "sessions.read",
  SESSIONS_MANAGE: "sessions.manage",

  TRIPS_READ: "trips.read",
  TRIPS_CREATE: "trips.create",
  TRIPS_UPDATE: "trips.update",

  FUEL_READ: "fuel.read",
  FUEL_CREATE: "fuel.create",

  EXPENSES_READ: "expenses.read",
  EXPENSES_CREATE: "expenses.create",
  EXPENSES_APPROVE: "expenses.approve",

  MAINTENANCE_READ: "maintenance.read",
  MAINTENANCE_CREATE: "maintenance.create",
  MAINTENANCE_UPDATE: "maintenance.update",

  TYRES_READ: "tyres.read",
  TYRES_MANAGE: "tyres.manage",

  CUSTOMERS_READ: "customers.read",
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_UPDATE: "customers.update",

  VENDORS_READ: "vendors.read",
  VENDORS_CREATE: "vendors.create",
  VENDORS_UPDATE: "vendors.update",

  PROJECTS_READ: "projects.read",
  PROJECTS_CREATE: "projects.create",
  PROJECTS_UPDATE: "projects.update",

  TENDERS_READ: "tenders.read",
  TENDERS_CREATE: "tenders.create",
  TENDERS_UPDATE: "tenders.update",

  INVOICES_READ: "invoices.read",
  INVOICES_CREATE: "invoices.create",
  INVOICES_UPDATE: "invoices.update",
  INVOICES_VOID: "invoices.void",

  FINANCE_READ: "finance.read",
  FINANCE_CREATE: "finance.create",
  FINANCE_UPDATE: "finance.update",

  REPORTS_READ: "reports.read",

  USERS_READ: "users.read",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",

  SETTINGS_MANAGE: "settings.manage",
  AUDIT_READ: "audit.read",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
