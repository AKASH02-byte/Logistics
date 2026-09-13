# Routes

## Public / shared

```
/login                          role-agnostic entry; two tabs/panels
                                 (Admin/Staff via Google, Labour via ID+Key)
```

## Admin/Staff portal — `app/(admin)`

```
/admin/dashboard                 KPI overview (trucks active, trips today, dues, alerts)

/admin/trucks                    list + filters
/admin/trucks/new
/admin/trucks/[id]                detail: info, documents, session history, maintenance, tyres

/admin/drivers                   labour list
/admin/drivers/new                create labour -> shows generated Login Key once
/admin/drivers/[id]               detail: documents, session history, trip history

/admin/sessions                  vehicle sessions (open/closed), force-close action

/admin/trips                     list + filters (truck, labour, project, date range)
/admin/trips/[id]

/admin/fuel                      fuel transaction log
/admin/expenses                  expense log, approval queue
/admin/maintenance               maintenance schedule + history
/admin/tyres                     tyre inventory + fitment history

/admin/customers
/admin/customers/[id]
/admin/vendors
/admin/vendors/[id]

/admin/projects
/admin/projects/new
/admin/projects/[id]              detail: expenses, linked trips, profitability

/admin/tenders
/admin/tenders/new
/admin/tenders/[id]                detail: documents, checklist, status timeline

/admin/invoices
/admin/invoices/new
/admin/invoices/[id]
/admin/payments
/admin/accounts
/admin/accounts/[id]               ledger view

/admin/reports                   fleet utilization, financial summary, project profitability

/admin/settings/users             user + role management
/admin/settings/audit-logs
/admin/settings/notifications
```

Layout: `app/(admin)/layout.tsx` resolves the Supabase Auth session and the
`users` row server-side; if no active role, redirect to a "pending approval"
screen rather than the dashboard. Per-page permission gating additionally
hides nav items the current role has no `*.read` permission for — a UX
convenience, not the authorization boundary (see [RBAC.md](RBAC.md)).

## Driver/Labour portal — `app/(driver)`

```
/driver/select-truck              shown when the labour has no OPEN session
/driver/dashboard                 today's session: truck, odometer, trips, fuel
/driver/trips/new
/driver/trips/[id]/close
/driver/fuel/new
/driver/history                   past sessions/trips (own only)
```

Layout: `app/(driver)/layout.tsx` resolves the labour session cookie
server-side; if none, redirect to `/login`. If a labour has no OPEN
`vehicle_sessions` row, every driver route redirects to `/driver/select-truck`
first — they cannot reach the dashboard without an active session.

## Middleware

`middleware.ts` at the project root only handles the cheap routing split
(which cookie is present → which portal segment is reachable) and Supabase
session refresh, per `@supabase/ssr` guidance. It does not do permission
checks — those stay server-side in layouts/route handlers where the full
database-backed identity is available.
