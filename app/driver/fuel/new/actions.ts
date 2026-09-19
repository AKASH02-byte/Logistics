"use server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { requireLabourSession } from "@/lib/rbac/labour";
import { revalidatePath } from "next/cache";

export async function submitFuel(
  vehicleSessionId: string,
  odometer: number,
  liters: number,
  cost: number
) {
  const labour = await requireLabourSession();
  const supabase = createSupabaseServiceRoleClient();
  const { data: session } = await supabase
    .from("vehicle_sessions")
    .select("id, truck_id")
    .eq("id", vehicleSessionId)
    .eq("labour_id", labour.id)
    .eq("status", "OPEN")
    .maybeSingle();
  if (!session) throw new Error("Active vehicle session not found");

  const { error } = await supabase.from("fuel_transactions").insert({
    truck_id: session.truck_id,
    vehicle_session_id: session.id,
    odometer_at_fill: odometer,
    litres: liters,
    rate_per_litre: cost / liters,
    filled_by: labour.id,
  });
  if (error) throw error;
  revalidatePath("/driver/dashboard");
  revalidatePath("/admin/fuel");
}
