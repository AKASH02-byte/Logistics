import { createClient } from "@supabase/supabase-js";
import { demoStore } from "@/lib/demo/store";
import { hashLoginKey } from "@/lib/auth/labour-credentials";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  }

  const supabase = createClient(url, serviceRoleKey);

  for (const labour of demoStore.labours) {
    const { data: savedLabour, error: labourError } = await supabase
      .from("labours")
      .upsert(
        {
          labour_code: labour.labourCode,
          full_name: labour.fullName,
          phone: labour.phone,
          status: labour.status === "ACTIVE" ? "ACTIVE" : "SUSPENDED",
        },
        { onConflict: "labour_code" }
      )
      .select("id")
      .single();
    if (labourError) throw labourError;

    const loginKeyHash = await hashLoginKey(labour.loginKey);
    const { error: credentialError } = await supabase
      .from("labour_credentials")
      .upsert(
        { labour_id: savedLabour.id, login_key_hash: loginKeyHash },
        { onConflict: "labour_id" }
      );
    if (credentialError) throw credentialError;
  }

  for (const truck of demoStore.trucks) {
    const { error } = await supabase.from("trucks").upsert(
      {
        registration_number: truck.registrationNumber,
        make: truck.make,
        model: truck.model,
        status: truck.status === "IN_MAINTENANCE" ? "IN_MAINTENANCE" : "ACTIVE",
        current_odometer: truck.currentOdometer,
      },
      { onConflict: "registration_number" }
    );
    if (error) throw error;
  }

  console.log(`Seeded ${demoStore.labours.length} labour accounts and ${demoStore.trucks.length} trucks.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
