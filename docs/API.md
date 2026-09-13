# API

All API routes live under `app/api/**` as Next.js Route Handlers returning
JSON. Two top-level namespaces, matching the two portals:

```
/api/admin/**    admin/staff surface — Supabase Auth session required
/api/driver/**   labour surface — labour session cookie required
/api/auth/**     shared: login, logout, session
```

## Conventions

- Every handler validates its input with a Zod schema from
  `lib/validation/*` before touching the database — invalid input is
  rejected with `400` and a field-level error map, never silently coerced.
- Every `admin` handler starts with `requirePermission(request, 'module.action')`
  (see [RBAC.md](RBAC.md)). Every `driver` handler starts with
  `requireLabourSession(request)` and then scopes all queries to that
  labour's own `labour_id`.
- Responses: `{ data }` on success, `{ error: { code, message, fields? } }`
  on failure. HTTP status carries the category (`400` validation, `401` no
  session, `403` no permission, `404` not found/soft-deleted, `409`
  conflict, `500` unexpected).
- Mutations that change money, credentials, or roles write an `audit_logs`
  row (`before_data`/`after_data`) in the same transaction.
- List endpoints are paginated (`?page=&pageSize=`, default 25, max 100) and
  support the filters relevant to that resource (status, date range, truck,
  project, etc.) — never an unbounded `select *`.

## Admin namespace (representative — see route folders for the full set)

```
GET    /api/admin/trucks                list/filter trucks
POST   /api/admin/trucks                create truck
GET    /api/admin/trucks/:id            truck detail + documents
PATCH  /api/admin/trucks/:id            update truck
DELETE /api/admin/trucks/:id            retire truck (soft delete)
POST   /api/admin/trucks/:id/documents  upload truck document

GET    /api/admin/labours               list labours
POST   /api/admin/labours               create labour -> generates Login Key
GET    /api/admin/labours/:id
PATCH  /api/admin/labours/:id
POST   /api/admin/labours/:id/reset-key regenerate Login Key (invalidates old)

GET    /api/admin/vehicle-sessions      list sessions (filter: open/closed, truck, labour)
POST   /api/admin/vehicle-sessions/:id/force-close

GET    /api/admin/trips
PATCH  /api/admin/trips/:id

GET    /api/admin/fuel
GET    /api/admin/expenses
POST   /api/admin/expenses
PATCH  /api/admin/expenses/:id/approve

GET    /api/admin/maintenance
POST   /api/admin/maintenance
GET    /api/admin/tyres

GET    /api/admin/customers        POST /api/admin/customers
GET    /api/admin/vendors          POST /api/admin/vendors

GET    /api/admin/projects         POST /api/admin/projects
GET    /api/admin/projects/:id/expenses

GET    /api/admin/tenders          POST /api/admin/tenders
POST   /api/admin/tenders/:id/checklist-items
PATCH  /api/admin/tenders/:id/checklist-items/:itemId

GET    /api/admin/invoices         POST /api/admin/invoices
PATCH  /api/admin/invoices/:id
POST   /api/admin/invoices/:id/items

GET    /api/admin/payments         POST /api/admin/payments
GET    /api/admin/accounts         GET /api/admin/accounts/:id/transactions

GET    /api/admin/reports/fleet-utilization
GET    /api/admin/reports/financial-summary
GET    /api/admin/reports/project-profitability

GET    /api/admin/users            POST /api/admin/users
PATCH  /api/admin/users/:id/role

GET    /api/admin/audit-logs
GET    /api/admin/notifications
```

## Driver namespace

```
POST   /api/driver/login                 { labourId, loginKey } -> session cookie
POST   /api/driver/logout

GET    /api/driver/trucks/available      trucks with no OPEN session, ACTIVE status
POST   /api/driver/sessions              open a session { truckId, openingOdometer }
POST   /api/driver/sessions/current/close  close own open session { closingOdometer }
GET    /api/driver/sessions/current

POST   /api/driver/trips                 create a trip within the current session
PATCH  /api/driver/trips/:id/close       { endingOdometer }
GET    /api/driver/trips                 own trip history

POST   /api/driver/fuel                  log a fuel fill-up for the current session
GET    /api/driver/notifications
```

## Auth namespace

```
GET    /api/auth/callback        Supabase OAuth callback (admin/staff)
POST   /api/auth/logout          admin/staff logout
```
