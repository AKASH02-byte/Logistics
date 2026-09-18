"use server";

import { logTrip, demoStore, getOpenSessionForLabour } from "@/lib/demo/store";
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
  const session = demoStore.vehicleSessions.find(
    (s) => s.id === vehicleSessionId
  );
  const sessionOpeningOdometer = session?.openingOdometer;

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
  logTrip({ vehicleSessionId, startOdometer, endOdometer, fromLocation, toLocation });
  revalidatePath("/driver/dashboard");
  revalidatePath("/admin/trips");
  revalidatePath("/admin/dashboard");

  return { ok: true, warnings: warnings.length > 0 ? warnings : undefined };
}
