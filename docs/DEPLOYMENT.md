# Deployment

## Architecture

Deploy the application as one Next.js service on Vercel. The browser UI and
backend route handlers under `app/api/**` are deployed together; there is no
separate backend server to run.

Use Supabase for the production PostgreSQL database, authentication, and file
storage described by the migrations and architecture docs.

## Current limitation

The checked-in app is still in demo mode. `lib/demo/store.ts` keeps accounts
and operational state in memory, so it is suitable for a temporary preview but
not for production data. A process restart or another server instance resets
that state.

Before using this for real operations, complete the Supabase-backed auth and
persistence work described in `docs/DEVELOPMENT_PLAN.md`. Do not put the demo
admin password or labour login keys into a production workflow.

## Temporary preview deployment

1. Push this repository to GitHub.
2. Import the repository into Vercel and keep the detected Next.js settings.
3. Add these Vercel environment variables for the Production environment:

   ```text
   SESSION_SECRET=<a long random value>
   NEXT_PUBLIC_APP_URL=https://<your-vercel-domain>
   ```

   Generate a secret locally with:

   ```bash
   openssl rand -base64 32
   ```

4. Deploy. The frontend and `/api/*` routes will be available at the same
   domain.
5. Test `/login`, `/admin/dashboard`, and the driver flow. The demo login
   values are only for preview testing and are defined in `lib/demo/store.ts`.

## Production database setup

1. Create a Supabase project.
2. Apply the migrations in order:

   ```text
   supabase/migrations/0001_init.sql
   supabase/migrations/0002_permissions_seed.sql
   supabase/migrations/0003_rls.sql
   ```

3. Configure the Supabase Auth redirect URL to include:

   ```text
   https://<your-vercel-domain>/api/auth/callback
   ```

4. Add the Supabase public URL/key and server-only service-role key when the
   Supabase-backed implementation is restored. Never expose the service-role
   key with a `NEXT_PUBLIC_` prefix.
5. Re-deploy from Vercel and run the Super Admin bootstrap procedure in
   `docs/SETUP_ADMIN.md`.

## Local production check

Run these before each deployment:

```bash
npm run lint
npm run build
```

A custom domain can be attached in Vercel after the deployment is healthy;
update `NEXT_PUBLIC_APP_URL` whenever the canonical URL changes.
