# Logistics + Infrastructure ERP

A logistics and infrastructure/construction business management system for
an Indian fleet operation (~150 trucks, built to scale beyond that): trucks,
drivers/labour, trips, fuel, expenses, maintenance, tyres, customers,
vendors, projects, tenders, invoicing, payments, accounts, documents,
notifications, and reporting.

Two portals, one app: an admin/staff console (Supabase Auth / Google OAuth)
and a driver/labour app (admin-issued Labour ID + Login Key, no OTP, no
self-registration). GPS/live tracking is explicitly out of scope — trip
distance is `ending odometer − starting odometer`.

Start with [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and
[docs/DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md) before touching code.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [RBAC / authorization model](docs/RBAC.md)
- [API](docs/API.md)
- [Routes](docs/ROUTES.md)
- [UX / design language](docs/UX.md)
- [Development plan](docs/DEVELOPMENT_PLAN.md)
- [Bootstrapping the first Super Admin](docs/SETUP_ADMIN.md)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase project keys
npm run dev
```

Apply database migrations (in order) via the Supabase CLI or SQL editor:

```
supabase/migrations/0001_init.sql
supabase/migrations/0002_permissions_seed.sql
supabase/migrations/0003_rls.sql
```

Then bootstrap the first Super Admin — see
[docs/SETUP_ADMIN.md](docs/SETUP_ADMIN.md).

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · PostgreSQL (Supabase) ·
Supabase Auth (`@supabase/ssr`) · Supabase Storage · Zod · Recharts ·
lucide-react.
