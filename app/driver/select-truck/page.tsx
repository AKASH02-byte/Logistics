import { redirect } from "next/navigation";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { requireLabourSession } from "@/lib/rbac/labour";
import { TruckPicker } from "./TruckPicker";

export default async function SelectTruckPage() {
  const labour = await requireLabourSession();
  const supabase = createSupabaseServiceRoleClient();

  const { data: existingSession } = await supabase
    .from("vehicle_sessions")
    .select("id")
    .eq("labour_id", labour.id)
    .eq("status", "OPEN")
    .maybeSingle();

  if (existingSession) {
    redirect("/driver/dashboard");
  }

  const { data: openSessions } = await supabase
    .from("vehicle_sessions")
    .select("truck_id")
    .eq("status", "OPEN");

  const busyTruckIds = (openSessions ?? []).map((s) => s.truck_id);

  let query = supabase
    .from("trucks")
    .select("id, registration_number, make, model, current_odometer")
    .eq("status", "ACTIVE")
    .is("deleted_at", null)
    .order("registration_number");

  if (busyTruckIds.length > 0) {
    query = query.not("id", "in", `(${busyTruckIds.join(",")})`);
  }

  const { data: trucks } = await query;

  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        Select today&rsquo;s truck
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.25rem" }}>
        Welcome, {labour.full_name}. Pick the truck you&rsquo;re driving today.
      </p>
      <TruckPicker trucks={trucks ?? []} />
    </div>
  );
}
