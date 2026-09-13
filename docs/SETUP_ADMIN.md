# Bootstrapping the first Super Admin

Google OAuth sign-in creates an identity, never a role. A fresh install has
zero rows in `users`, so no one can pass a `users.update` check to promote
anyone — including themselves. This is resolved by a one-time, out-of-band
bootstrap script, not by special-casing "the first Google user" in app code
(that would be a silent, undocumented privilege escalation path).

## Procedure

1. Deploy the app and apply all migrations.
2. Sign in once via `/login` with the Google account that should become the
   Super Admin. The OAuth callback creates a `users` row with a placeholder
   `role = 'STAFF'` (the `role` column is `NOT NULL`) but `status =
   'INVITED'`. `requirePermission()` rejects any non-`ACTIVE` user
   regardless of role, so this account can authenticate but has zero
   permissions until step 3 runs.
3. Run the bootstrap script from the server (never from the browser):

   ```bash
   npm run bootstrap:admin -- --email=owner@company.com
   ```

   `scripts/bootstrap-admin.ts` connects with the Supabase **service role**
   key (server-only env var, never bundled to the client) and:
   - looks up the `users` row by email,
   - sets `role = 'SUPER_ADMIN'`, `status = 'ACTIVE'`,
   - writes an `audit_logs` entry recording the bootstrap action.

4. The script refuses to run if a `SUPER_ADMIN` already exists, unless
   `--force` is passed explicitly — this prevents accidental re-bootstrapping
   in production.

## Why not automatic

Automatically granting `SUPER_ADMIN` to "the first user who signs in" is a
race condition and a security hole (anyone who signs in first — including
someone who guesses the URL before the real owner does — becomes the owner
of the entire system). The bootstrap script requires server/deploy access,
which is a meaningfully different trust boundary than "has a Google
account."

## Ongoing admin creation

After bootstrap, all further role/user management happens inside the app
(`/admin/settings/users`), gated by `users.create` / `users.update`, and is
audit-logged like any other privileged action. The bootstrap script is only
for the very first account.
