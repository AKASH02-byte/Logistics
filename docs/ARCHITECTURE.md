# Architecture

## 1. What this system is

A production-oriented ERP for an Indian logistics + infrastructure business
running ~150 trucks today, designed to scale well past that. One Next.js
application, one PostgreSQL database (Supabase), two distinct portal
experiences served from the same domain:

- **Admin/Staff portal** — `/admin/**`, authenticated via Supabase Auth
  (Google OAuth in production).
- **Driver/Labour portal** — `/driver/**`, authenticated via a custom
  Labour ID + Login Key flow (no Supabase Auth session, no OTP, no
  self-registration).

GPS/live tracking is explicitly out of scope (see [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md)
for the record of that decision). Trip distance = ending odometer − starting
odometer.

## 2. Tech stack

| Concern            | Choice |
|--------------------|--------|
| Framework          | Next.js (App Router), TypeScript, React |
| Styling            | Tailwind CSS + CSS variables for theme tokens |
| Database           | PostgreSQL via Supabase |
| Auth (admin/staff) | Supabase Auth (Google OAuth), `@supabase/ssr` cookie sessions |
| Auth (labour)      | Custom Labour ID + hashed Login Key, server-issued session cookie |
| File storage       | Supabase Storage (truck docs, driver docs, tender docs, receipts) |
| Validation         | Zod schemas shared between client forms and API route handlers |
| Charts             | Recharts |
| Icons              | lucide-react |

## 3. High-level request flow

```
Browser
  │
  ├── Admin/Staff: Supabase Auth session cookie (SSR, via @supabase/ssr)
  │      → middleware resolves session → app/(admin) routes
  │
  └── Driver/Labour: custom session cookie (signed, server-issued)
         → middleware resolves labour session → app/(driver) routes

Every API route re-derives identity from the request (cookie), looks up the
application role/permission set from PostgreSQL, and authorizes the specific
operation server-side. The frontend never gates access to data — it only
gates which UI is shown. See docs/RBAC.md for the authorization model.
```

## 4. Folder structure

```
Logistics App/
├── app/
│   ├── (auth)/              # /login — shared entry, splits by credential type
│   ├── (admin)/             # admin/staff portal screens, layout enforces role check
│   ├── (driver)/            # labour portal screens (truck selection, dashboard)
│   ├── api/                 # route handlers (REST-ish JSON API)
│   ├── layout.tsx
│   └── globals.css
├── components/              # shared UI components (by domain subfolder)
├── lib/
│   ├── supabase/            # browser + server Supabase client factories
│   ├── auth/                # labour credential hashing/session helpers
│   ├── rbac/                # permission checking helpers used by API routes
│   └── validation/          # Zod schemas
├── types/                   # shared TypeScript types (DB row types, DTOs)
├── hooks/                   # client-side React hooks
├── config/                  # app constants (roles, permission codes, etc.)
├── database/                # schema reference docs / seed data scripts
├── supabase/
│   └── migrations/          # numbered SQL migrations (source of truth for schema)
├── scripts/                 # one-off/admin scripts (bootstrap admin, seed demo data)
├── tests/                   # unit + integration tests
└── docs/                    # this documentation set
```

## 5. Why Supabase Auth is not the authorization source

Supabase Auth (and Google OAuth) establishes **identity** — it proves who is
signing in. It never determines **what that identity is allowed to do**.
Every Google account that signs in becomes an unprivileged `users` row with
no role until a Super Admin assigns one. See [SETUP_ADMIN.md](SETUP_ADMIN.md)
for the bootstrap sequence that avoids a chicken-and-egg problem here.

## 6. Labour identity is a separate table, not a Supabase Auth user

`labours` is independent from `users`/Supabase Auth. This is intentional:

- Labour accounts are created entirely by an Admin from inside the app — no
  external identity provider is involved.
- Labour credentials are a generated Labour ID + a generated Login Key,
  stored as `login_key_hash` (never plaintext, never logged).
- A labour's daily truck is not a fixed foreign key on the labour row — it is
  resolved per shift via `vehicle_sessions` (see [DATABASE.md](DATABASE.md#vehicle_sessions)).

## 7. Deployment

- Target: Vercel (Next.js) + Supabase (managed Postgres, Auth, Storage).
- Environment variables are documented in `.env.example`; secrets (service
  role key, session signing secret) are server-only and never exposed to the
  client bundle.
- Migrations are applied via the Supabase CLI (`supabase db push` or the SQL
  editor) in the order they are numbered under `supabase/migrations/`.

## 8. Non-goals (explicitly out of scope)

- GPS devices, live location, live maps, geofencing, telematics.
- Automatic/derived mileage from anything other than manual odometer entry.
- OTP-based or self-service login for labour accounts.
