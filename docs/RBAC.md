# Authorization model (RBAC)

## Principle

**The frontend is never the security boundary.** Hiding a button is a UX
courtesy, not a control. Every mutation and every sensitive read is
authorized again on the server, against the database, on every request.

```
Browser request
     │
     ▼
Session resolved (Supabase Auth cookie OR labour session cookie)
     │
     ▼
Server looks up the application identity (users row, or labours row)
     │
     ▼
Role resolved (app_role enum, or "LABOUR" for the driver surface)
     │
     ▼
Permission checked for the specific action (e.g. "trucks.update")
     │
     ▼
Database operation — additionally gated by Postgres RLS for the
admin/staff surface
```

A labour session calling `/api/admin/invoices` is rejected at the API route
(no `users` identity resolves for that session) before any query runs —
whether or not a button for it exists in their UI.

## Roles

```
SUPER_ADMIN       full system access, only role that can grant other roles
BUSINESS_OWNER    full operational + financial access
MANAGER           broad operational access, no user/role management
ACCOUNTANT        finance, invoices, payments, reports
FLEET_MANAGER     trucks, drivers, sessions, trips, fuel, maintenance, tyres
PROJECT_MANAGER   projects, tenders, project expenses
STAFF             read-only across operational modules
LABOUR            driver-portal only; not part of the permission matrix below
```

## Permissions

Permissions are granular strings, `module.action`, stored in the
`permissions` table and granted to roles via `role_permissions`
(see `supabase/migrations/0002_permissions_seed.sql` for the full catalogue
and default grants). Examples:

```
trucks.read   trucks.create   trucks.update   trucks.delete
drivers.read  drivers.create  drivers.update
trips.read    trips.create    trips.update
finance.read  finance.create  finance.update
invoices.read invoices.create invoices.update invoices.void
tenders.read  tenders.create  tenders.update
projects.read projects.create projects.update
users.read    users.create    users.update
settings.manage
audit.read
```

Never check `role === 'MANAGER'` in business logic. Always check a
permission: `hasPermission(identity, 'trucks.update')`. This lets permission
grants change per-role (or eventually per-user overrides) without touching
route code.

## Server-side enforcement (`lib/rbac`)

```ts
// lib/rbac/permissions.ts
export async function requirePermission(request: Request, code: PermissionCode) {
  const identity = await resolveIdentity(request); // Supabase session -> users row
  if (!identity) throw new UnauthorizedError();
  const allowed = await hasPermission(identity.role, code);
  if (!allowed) throw new ForbiddenError();
  return identity;
}
```

Every `app/api/admin/**` route handler calls `requirePermission` before
touching the database. This is the single choke point — it is not
duplicated ad hoc per route.

## Labour authorization

The driver portal is not permission-matrix-driven; it is a fixed, narrow
surface (open/close a vehicle session for yourself, log your own trips/fuel,
view your own history). Every driver API route:

1. Resolves the labour session cookie server-side.
2. Confirms the `labour_id` in the session matches the `labour_id` on the
   resource being read/written (a labour can never read another labour's
   trips by guessing an ID).
3. Confirms the vehicle session referenced is `OPEN` and belongs to that
   labour before allowing a trip/fuel write against it.

## Database-level enforcement (RLS)

Postgres RLS (`supabase/migrations/0003_rls.sql`) mirrors this permission
model for the admin/staff surface, which authenticates via Supabase Auth
(`auth.uid()` is populated). `has_permission(code)` is a SQL function that
performs the same `role_permissions` lookup used in application code, so a
compromised or buggy API route still cannot read/write data a role isn't
granted, even via the Supabase client directly.

Labour requests go through server-only routes using the service role key
(which bypasses RLS by design in Postgres/Supabase) — for that surface, the
API-route checks above ARE the enforcement layer. This is why labour session
resolution must never happen client-side and the service role key must never
reach the browser bundle.

## Super Admin bootstrap

Because role assignment is itself gated behind `users.update`, there must be
a controlled way to create the first Super Admin without a chicken-and-egg
deadlock. See [SETUP_ADMIN.md](SETUP_ADMIN.md).
