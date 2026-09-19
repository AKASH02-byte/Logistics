"use server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { requireLabourSession } from "@/lib/rbac/labour";
import { revalidatePath } from "next/cache";
import {
  validateTripOdometer,
  suggestOdometerCorrection,
} from "@/lib/validation/odometer";

export interface TripSubmitResult {
  ok: boolean;
  error?: string;
  /** Present when a likely typo was detected and auto-correction is available. */
  suggestion?: {
    correctedEndOdometer: number;
    message: string;
  };
  /** Non-blocking warnings to surface to the driver. */
  warnings?: string[];
}

export async function submitTrip(
  vehicleSessionId: string,
  startOdometer: number,
  endOdometer: number,
  fromLocation: string,
  toLocation: string
): Promise<TripSubmitResult> {
  // ── Look up the session's opening odometer for session-level validation ─
  const labour = await requireLabourSession();
  const supabase = createSupabaseServiceRoleClient();
  const { data: session } = await supabase
    .from("vehicle_sessions")
    .select("id, truck_id, opening_odometer")
    .eq("id", vehicleSessionId)
    .eq("labour_id", labour.id)
    .eq("status", "OPEN")
    .maybeSingle();
  if (!session) return { ok: false, error: "Active vehicle session not found" };
  const sessionOpeningOdometer = Number(session.opening_odometer);

  // ── Validate ─────────────────────────────────────────────────────────────
  const validation = validateTripOdometer(
    startOdometer,
    endOdometer,
    sessionOpeningOdometer
  );

  if (!validation.ok) {
    const errorIssue = validation.issues.find((i) => i.severity === "ERROR")!;

    // Attempt to suggest an auto-correction if the error is ODO_UNREALISTIC_DISTANCE
    let suggestion: TripSubmitResult["suggestion"];
    if (errorIssue.code === "ODO_UNREALISTIC_DISTANCE") {
      const corrected = suggestOdometerCorrection(startOdometer, endOdometer);
      if (corrected !== null) {
        suggestion = {
          correctedEndOdometer: corrected,
          message: `Did you mean ${corrected.toLocaleString("en-IN")} km? (Extra digit removed)`,
        };
      }
    }

    return {
      ok: false,
      error: `${errorIssue.message} — ${errorIssue.hint}`,
      suggestion,
    };
  }

  // ── Collect non-blocking warnings ─────────────────────────────────────────
  const warnings = validation.issues
    .filter((i) => i.severity === "WARNING")
    .map((i) => i.message);

  // ── Persist ───────────────────────────────────────────────────────────────
  const { error } = await supabase.from("trips").insert({
    vehicle_session_id: session.id,
    truck_id: session.truck_id,
    labour_id: labour.id,
    origin: fromLocation,
    destination: toLocation,
    starting_odometer: startOdometer,
    ending_odometer: endOdometer,
    status: "COMPLETED",
    started_at: new Date().toISOString(),
    ended_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: "Could not save trip" };
  revalidatePath("/driver/dashboard");
  revalidatePath("/admin/trips");
  revalidatePath("/admin/dashboard");

  return { ok: true, warnings: warnings.length > 0 ? warnings : undefined };
}
