import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { requireLabourSession } from "@/lib/rbac/labour";
import { jsonOk, toErrorResponse } from "@/lib/api/response";

export async function GET() {
  try {
    await requireLabourSession();
    const supabase = createSupabaseServiceRoleClient();
    const { data: openSessions } = await supabase
      .from("vehicle_sessions")
      .select("truck_id")
      .eq("status", "OPEN");
    const busyTruckIds = (openSessions ?? []).map((session) => session.truck_id);
    let query = supabase
      .from("trucks")
      .select("id, registration_number, make, model, current_odometer")
      .eq("status", "ACTIVE")
      .is("deleted_at", null)
      .order("registration_number");
    if (busyTruckIds.length > 0) query = query.not("id", "in", `(${busyTruckIds.join(",")})`);
    const { data, error } = await query;
    if (error) throw error;
    return jsonOk(data);
  } catch (err) {
    return toErrorResponse(err);
  }
}
