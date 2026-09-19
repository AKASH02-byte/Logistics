import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { requireLabourSession } from "@/lib/rbac/labour";
import { closeSessionSchema } from "@/lib/validation/vehicle-session";
import { jsonOk, jsonError, toErrorResponse } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const labour = await requireLabourSession();
    const body = closeSessionSchema.parse(await request.json());

    const supabase = createSupabaseServiceRoleClient();
    const { data: session, error: sessionError } = await supabase
      .from("vehicle_sessions")
      .select("id, truck_id, opening_odometer")
      .eq("labour_id", labour.id)
      .eq("status", "OPEN")
      .maybeSingle();
    if (sessionError || !session) {
      return jsonError(404, "NO_OPEN_SESSION", "You have no open session to close");
    }

    if (body.closingOdometer < Number(session.opening_odometer)) {
      return jsonError(
        400,
        "INVALID_ODOMETER",
        "Closing odometer cannot be less than the opening odometer"
      );
    }

    const { data: updated, error } = await supabase
      .from("vehicle_sessions")
      .update({ status: "CLOSED", closing_odometer: body.closingOdometer, closed_at: new Date().toISOString() })
      .eq("id", session.id)
      .select()
      .single();
    if (error) throw error;
    await supabase.from("trucks").update({ current_odometer: body.closingOdometer }).eq("id", session.truck_id);
    return jsonOk(updated);
  } catch (err) {
    return toErrorResponse(err);
  }
}
