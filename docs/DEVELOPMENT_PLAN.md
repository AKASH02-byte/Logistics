# Development plan

## Locked decisions (do not revisit without an explicit request)

- No GPS/live tracking/telematics anywhere in the product. Distance =
  ending odometer − starting odometer.
- One app, one database, two portals split by auth method, not by subdomain.
- Labour credentials (Labour ID + Login Key) are always admin-issued and
  database-backed — never hardcoded, never OTP, never self-registered.
- A labour has no permanent truck; `vehicle_sessions` resolves "today's
  truck" per shift and preserves history against the truck actually used.
- Currency ₹ INR, Indian digit grouping, throughout.

## Phases

**Phase 0 — Foundation (this pass)**
- Next.js + TypeScript + Tailwind scaffold, dependencies installed.
- Full PostgreSQL schema (`supabase/migrations/0001_init.sql`).
- Permission catalogue + role grants (`0002_permissions_seed.sql`).
- Row Level Security (`0003_rls.sql`).
- Architecture/database/RBAC/API/routes/UX docs (this folder).

**Phase 1 — Auth + shell**
- Supabase browser/server client factories (`lib/supabase`).
- Admin auth via Supabase Auth (Google OAuth) + `proxy.ts` session
  refresh per `@supabase/ssr`.
- Labour auth: Login Key hashing (`lib/auth/labour.ts`), session cookie
  issuance/verification, `/api/driver/login`.
- `requirePermission` / `requireLabourSession` helpers (`lib/rbac`).
- Bootstrap admin script (`scripts/bootstrap-admin.ts`) + `SETUP_ADMIN.md`
  procedure verified end-to-end.
- Admin shell (nav + topbar) and driver shell layouts, empty-state pages
  for every route in `docs/ROUTES.md`.
- Driver login screen: SVG truck + CSS animation states.

**Phase 2 — Fleet + labour operations**
- Trucks CRUD + documents, labour CRUD + documents + Login Key issuance/reset.
- Vehicle session flow end-to-end (select truck → open → close), admin
  force-close, session history views.
- Trip logging (driver + admin), fuel transactions.

**Phase 3 — Finance**
- Expenses (log + approval), maintenance, tyres.
- Customers, vendors, accounts.
- Invoices + invoice items, payments, account ledger.

**Phase 4 — Projects & tenders**
- Projects + project expenses + profitability rollups.
- Tenders + documents + checklist.

**Phase 5 — Reporting, notifications, polish**
- Reports (fleet utilization, financial summary, project profitability).
- Notifications, audit log viewer.
- Document expiry alerts (RC/insurance/permit/licence).
- Demo data seed script for realistic walkthroughs (`scripts/seed-demo.ts`) —
  no hardcoded business data in application code, only in a seed script that
  writes to the database.

**Phase 6 — Testing & hardening**
- Unit tests for RBAC helpers, Zod schemas, odometer/business-rule
  constraints.
- Integration tests for the labour login → session → trip flow and the
  admin permission boundary (a LABOUR session hitting `/api/admin/*` must
  get 401/403).
- Security pass: rate limiting on `/api/driver/login`, login key rotation,
  audit log coverage on all privileged mutations.

## Status

Phase 0 complete. Phase 1 (auth + shell) implemented: Supabase client
factories, admin auth via `@supabase/ssr` + OAuth callback, labour auth
(Login Key hashing/lockout, signed session cookie, `/api/driver/login`),
`requirePermission`/`requireLabourSession`, `proxy.ts` session refresh,
bootstrap-admin script, admin/driver shells with placeholder pages for
every route in docs/ROUTES.md, the vehicle-session open/close API, and the
driver login screen (SVG truck + CSS idle/departing animation). Not yet
tested end-to-end against a real Supabase project — no project has been
provisioned yet. Phase 2 (fleet + labour operations UI) is next.
