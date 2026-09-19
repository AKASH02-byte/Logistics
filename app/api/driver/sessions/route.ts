import {
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";
import { requireLabourSession } from "@/lib/rbac/labour";
import { openSessionSchema } from "@/lib/validation/vehicle-session";
import { jsonOk, jsonError, toErrorResponse } from "@/lib/api/response";

export async function GET() {
  try {
    const labour = await requireLabourSession();
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("vehicle_sessions")
      .select("*, trucks(registration_number, make, model)")
      .eq("labour_id", labour.id)
      .eq("status", "OPEN")
      .maybeSingle();
    if (error) throw error;
    return jsonOk(data);
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    const labour = await requireLabourSession();
    const body = openSessionSchema.parse(await request.json());

    const supabase = createSupabaseServiceRoleClient();
    const { data: existing } = await supabase
      .from("vehicle_sessions")
      .select("id")
      .eq("labour_id", labour.id)
      .eq("status", "OPEN")
      .maybeSingle();
    if (existing) {
      return jsonError(409, "SESSION_ALREADY_OPEN", "You already have an open session today");
    }

    const { data: truck, error: truckError } = await supabase
      .from("trucks")
      .select("id, status, current_odometer")
      .eq("id", body.truckId)
      .is("deleted_at", null)
      .maybeSingle();
    if (truckError || !truck || truck.status !== "ACTIVE") {
      return jsonError(404, "TRUCK_UNAVAILABLE", "This truck is not available");
    }

    const { data: session, error } = await supabase
      .from("vehicle_sessions")
      .insert({ labour_id: labour.id, truck_id: truck.id, opening_odometer: truck.current_odometer })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") return jsonError(409, "TRUCK_ALREADY_TAKEN", "Another driver just took this truck");
      throw error;
    }
    return jsonOk(session, 201);
  } catch (err) {
    return toErrorResponse(err);
  }
}
