/**
 * One-time bootstrap for the first SUPER_ADMIN. Run from a trusted server
 * context only — never expose this as an HTTP endpoint. See
 * docs/SETUP_ADMIN.md for the full procedure.
 *
 * Usage:
 *   npm run bootstrap:admin -- --email=owner@company.com [--force]
 */
import { createClient } from "@supabase/supabase-js";

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)(?:=(.*))?$/);
    if (match) args[match[1]] = match[2] ?? true;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = args.email as string | undefined;
  const force = Boolean(args.force);

  if (!email) {
    console.error("Usage: npm run bootstrap:admin -- --email=owner@company.com [--force]");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment."
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey);

  const { data: existingSuperAdmin } = await supabase
    .from("users")
    .select("id, email")
    .eq("role", "SUPER_ADMIN")
    .is("deleted_at", null)
    .maybeSingle();

  if (existingSuperAdmin && !force) {
    console.error(
      `A SUPER_ADMIN already exists (${existingSuperAdmin.email}). Pass --force to override.`
    );
    process.exit(1);
  }

  const { data: user, error: lookupError } = await supabase
    .from("users")
    .select("id, email, role, status")
    .eq("email", email)
    .maybeSingle();

  if (lookupError || !user) {
    console.error(
      `No user found for ${email}. They must sign in via Google at /login at least once first.`
    );
    process.exit(1);
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ role: "SUPER_ADMIN", status: "ACTIVE" })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to promote user:", updateError.message);
    process.exit(1);
  }

  await supabase.from("audit_logs").insert({
    actor_user_id: user.id,
    action: "BOOTSTRAP_SUPER_ADMIN",
    entity_type: "users",
    entity_id: user.id,
    after_data: { role: "SUPER_ADMIN", status: "ACTIVE" },
  });

  console.log(`✓ ${email} is now SUPER_ADMIN and ACTIVE.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
