/**
 * lib/validation/odometer.ts
 *
 * Odometer & distance validation utilities.
 *
 * WHY THIS EXISTS:
 * Raw odometer reads from drivers are prone to two failure modes:
 *   1. Typo (e.g., driver types 1_128_450 instead of 128_450) — produces a
 *      phantom 1,000,000 km trip.
 *   2. Odometer wrap-around or accidental decrease — negative distance.
 *
 * We validate at the edge (server action) so bad data never reaches storage.
 */

// ─── Constants ──────────────────────────────────────────────────────────────

/**
 * Maximum realistic distance (km) a commercial truck can cover in a single
 * SHIFT. India's longest direct highway corridor (e.g. Srinagar–Kanyakumari)
 * is ~3,800 km, but a single driver shift is typically 10–14 h at ~60 km/h
 * average = 600–840 km. We cap at 1,500 km to allow for overnight multi-stop
 * relays without false positives.
 */
export const MAX_SINGLE_TRIP_KM = 1_500;

/**
 * Minimum acceptable trip distance in km.
 * Zero-distance trips are almost always a form entry error.
 */
export const MIN_SINGLE_TRIP_KM = 0.5;

/**
 * Maximum single-session odometer advance (km) — i.e., the most any truck
 * can travel between session open and close across ALL trips in that session.
 * 48-hour relay → 2 × 840 km ≈ 1,700 km; cap at 3,000 for safety margin.
 */
export const MAX_SESSION_ADVANCE_KM = 3_000;

/**
 * Maximum plausible fuel efficiency for a laden heavy truck (km/L).
 * Very efficient trucks do ~5–6 km/L. Anything above this for a given
 * segment implies either a mis-entered odometer or a duplicate log.
 */
export const MAX_KM_PER_LITRE = 8;

/**
 * Minimum plausible fuel efficiency (km/L).
 * Below 1 km/L is almost certainly an odometer typo.
 */
export const MIN_KM_PER_LITRE = 1;

// ─── Types ──────────────────────────────────────────────────────────────────

export type ValidationSeverity = "ERROR" | "WARNING";

export interface ValidationIssue {
  code: string;
  severity: ValidationSeverity;
  message: string;
  /** Human-readable guidance for the driver / dispatcher. */
  hint: string;
}

export interface OdometerValidationResult {
  ok: boolean;               // false if any ERROR severity issue found
  distance: number;          // computed distance (endOdometer - startOdometer)
  issues: ValidationIssue[];
}

// ─── Core Validator ──────────────────────────────────────────────────────────

/**
 * Validates odometer readings before persisting a trip.
 *
 * @param startOdometer  Opening odometer for the trip (km)
 * @param endOdometer    Closing odometer entered by the driver (km)
 * @param sessionOpeningOdometer  Opening odometer of the parent vehicle session,
 *        used to catch cumulative session overflow (optional but recommended).
 *
 * @example
 * const result = validateTripOdometer(128_450, 128_992);
 * if (!result.ok) throw new Error(result.issues[0].message);
 */
export function validateTripOdometer(
  startOdometer: number,
  endOdometer: number,
  sessionOpeningOdometer?: number
): OdometerValidationResult {
  const issues: ValidationIssue[] = [];
  const distance = endOdometer - startOdometer;

  // ── Guard: both values must be positive integers ────────────────────────
  if (!Number.isFinite(startOdometer) || startOdometer < 0) {
    issues.push({
      code: "ODO_START_INVALID",
      severity: "ERROR",
      message: `Starting odometer (${startOdometer}) is not a valid positive number.`,
      hint: "Enter the odometer reading shown on the dashboard at the start of this trip.",
    });
  }

  if (!Number.isFinite(endOdometer) || endOdometer < 0) {
    issues.push({
      code: "ODO_END_INVALID",
      severity: "ERROR",
      message: `Ending odometer (${endOdometer}) is not a valid positive number.`,
      hint: "Enter the current odometer reading shown on the truck dashboard.",
    });
  }

  // Stop further checks if basic validity failed
  if (issues.some((i) => i.severity === "ERROR")) {
    return { ok: false, distance, issues };
  }

  // ── Guard: end must be ≥ start ──────────────────────────────────────────
  if (endOdometer < startOdometer) {
    issues.push({
      code: "ODO_NEGATIVE_DISTANCE",
      severity: "ERROR",
      message: `Ending odometer (${endOdometer.toLocaleString("en-IN")} km) is less than the starting odometer (${startOdometer.toLocaleString("en-IN")} km).`,
      hint:
        "The ending odometer reading must be equal to or greater than the start. " +
        "Check for a typo — you may have entered fewer digits than the actual reading.",
    });
    return { ok: false, distance, issues };
  }

  // ── Guard: zero-distance trip ────────────────────────────────────────────
  if (distance < MIN_SINGLE_TRIP_KM) {
    issues.push({
      code: "ODO_ZERO_DISTANCE",
      severity: "ERROR",
      message: `Trip distance of ${distance} km is below the minimum (${MIN_SINGLE_TRIP_KM} km).`,
      hint:
        "A zero or near-zero distance suggests the odometer was not updated. " +
        "Please re-check the dashboard reading.",
    });
  }

  // ── Guard: suspiciously large single-trip distance ───────────────────────
  if (distance > MAX_SINGLE_TRIP_KM) {
    issues.push({
      code: "ODO_UNREALISTIC_DISTANCE",
      severity: "ERROR",
      message:
        `Trip distance of ${distance.toLocaleString("en-IN")} km exceeds the maximum allowed per trip (${MAX_SINGLE_TRIP_KM.toLocaleString("en-IN")} km).`,
      hint:
        `The most likely cause is a mis-typed odometer reading — for example, ` +
        `entering 1,128,450 instead of 128,450. Please verify the ending odometer ` +
        `on the truck dashboard and correct any extra digits.`,
    });
  }

  // ── Warning: large-but-plausible distances (800–1500 km) ────────────────
  if (distance > 800 && distance <= MAX_SINGLE_TRIP_KM) {
    issues.push({
      code: "ODO_LARGE_DISTANCE_WARNING",
      severity: "WARNING",
      message: `Trip distance of ${distance.toLocaleString("en-IN")} km is unusually high for a single shift.`,
      hint:
        "Distances over 800 km in a single entry are uncommon. If this is correct, proceed. " +
        "Otherwise, re-check the odometer reading.",
    });
  }

  // ── Guard: cumulative session advance check ──────────────────────────────
  if (sessionOpeningOdometer !== undefined) {
    const sessionAdvance = endOdometer - sessionOpeningOdometer;
    if (sessionAdvance > MAX_SESSION_ADVANCE_KM) {
      issues.push({
        code: "ODO_SESSION_OVERFLOW",
        severity: "ERROR",
        message:
          `Total distance since session start is ${sessionAdvance.toLocaleString("en-IN")} km, ` +
          `which exceeds the maximum per-session limit (${MAX_SESSION_ADVANCE_KM.toLocaleString("en-IN")} km).`,
        hint:
          "This typically means an extra digit was accidentally added. " +
          "Verify the odometer reading against the truck dashboard.",
      });
    }
  }

  const hasError = issues.some((i) => i.severity === "ERROR");
  return { ok: !hasError, distance, issues };
}

// ─── Odometer entry sanitiser ────────────────────────────────────────────────

/**
 * Attempts to auto-correct a common mis-entry pattern:
 * driver adds a leading digit by mistake (e.g., 1128450 → 128450).
 *
 * This is a heuristic — only applied when:
 *   • The entered value is > MAX_SINGLE_TRIP_KM above the reference
 *   • Removing the first digit produces a value within a plausible range
 *
 * Returns the corrected value, or `null` if no safe correction is possible.
 *
 * @example
 * suggestOdometerCorrection(128_450, 1_128_992)
 * // → 128_992  (removed leading "1")
 */
export function suggestOdometerCorrection(
  referenceOdometer: number,
  enteredValue: number
): number | null {
  const asString = String(Math.round(enteredValue));
  if (asString.length < 2) return null;

  // Try removing each leading digit
  for (let trim = 1; trim < Math.min(asString.length, 4); trim++) {
    const candidate = Number(asString.slice(trim));
    if (
      candidate > referenceOdometer &&
      candidate - referenceOdometer <= MAX_SINGLE_TRIP_KM
    ) {
      return candidate;
    }
  }

  return null;
}
