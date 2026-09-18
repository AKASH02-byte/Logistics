/**
 * lib/analytics/fleet.ts
 *
 * Fleet analytics — aggregation and KPI calculations.
 *
 * All functions are pure (no side-effects) and accept the store slices they
 * need as arguments so they are trivially testable and DB-agnostic.
 * When we migrate to Supabase, the SQL equivalents are documented inline.
 */

import type { DemoTruck, DemoFuel, DemoTrip, DemoVehicleSession } from "@/lib/demo/store";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FuelAggregation {
  /** Total cost (₹) across all logged fuel transactions. */
  totalCost: number;
  /** Total litres dispensed. */
  totalLitres: number;
  /** Overall km/L across all trips that have paired fuel data. */
  overallEfficiency: number | null;
  /** Cost per kilometre (₹/km) — useful for cost-of-operations reporting. */
  costPerKm: number | null;
  /** Breakdown per truck registration. */
  perTruck: {
    truckId: string;
    registrationNumber: string;
    totalCost: number;
    totalLitres: number;
    efficiency: number | null;
  }[];
}

export interface FleetUtilization {
  /** Number of trucks currently with status = "ACTIVE". */
  activeTrucks: number;
  /** Number of trucks currently on an OPEN session. */
  deployedTrucks: number;
  /** Trucks in maintenance. */
  maintenanceTrucks: number;
  /** Retired / decommissioned trucks. */
  retiredTrucks: number;
  /** Total fleet size. */
  totalTrucks: number;
  /**
   * Active utilization rate (%): deployed / active × 100.
   * Answers: "Of the trucks that COULD be sent out, how many are?"
   */
  activeUtilizationRate: number;
  /**
   * Fleet utilization rate (%): deployed / total × 100.
   * Answers: "Of every truck we own, how many are earning right now?"
   */
  fleetUtilizationRate: number;
  /**
   * Availability rate (%): (active - deployed) / total × 100.
   * Answers: "What fraction of the fleet is idle but ready?"
   */
  availabilityRate: number;
}

export interface TripAggregation {
  totalTrips: number;
  totalDistanceKm: number;
  averageDistanceKm: number;
  longestTripKm: number;
  shortestTripKm: number;
}

// ─── 1. Fuel Spend Aggregation ───────────────────────────────────────────────

/**
 * Aggregates fuel costs from the fuel log table.
 *
 * SQL equivalent (for future Supabase migration):
 * ```sql
 * SELECT
 *   SUM(cost)           AS total_cost,
 *   SUM(liters)         AS total_litres,
 *   SUM(cost) / NULLIF(SUM(liters), 0) AS cost_per_litre
 * FROM fuel_logs;
 *
 * -- Per truck:
 * SELECT
 *   t.registration_number,
 *   SUM(f.cost)   AS total_cost,
 *   SUM(f.liters) AS total_litres
 * FROM fuel_logs f
 * JOIN vehicle_sessions vs ON f.vehicle_session_id = vs.id
 * JOIN trucks t            ON vs.truck_id = t.id
 * GROUP BY t.id, t.registration_number
 * ORDER BY total_cost DESC;
 * ```
 *
 * @param fuelLogs  All fuel log records.
 * @param sessions  Vehicle sessions — used to resolve truck per fuel entry.
 * @param trucks    Truck master list.
 * @param trips     Trip records — used to compute km/L efficiency.
 */
export function aggregateFuelSpend(
  fuelLogs: DemoFuel[],
  sessions: DemoVehicleSession[],
  trucks: DemoTruck[],
  trips: DemoTrip[]
): FuelAggregation {
  // Build lookup maps for O(1) access
  const sessionById = new Map(sessions.map((s) => [s.id, s]));
  const truckById = new Map(trucks.map((t) => [t.id, t]));

  // ── Global totals ──────────────────────────────────────────────────────
  const totalCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
  const totalLitres = fuelLogs.reduce((sum, f) => sum + f.liters, 0);

  // ── Total distance from all trips (for global efficiency) ─────────────
  const totalDistanceKm = trips.reduce(
    (sum, t) => sum + (t.endOdometer - t.startOdometer),
    0
  );
  const overallEfficiency =
    totalLitres > 0 && totalDistanceKm > 0
      ? parseFloat((totalDistanceKm / totalLitres).toFixed(2))
      : null;

  const costPerKm =
    totalDistanceKm > 0
      ? parseFloat((totalCost / totalDistanceKm).toFixed(2))
      : null;

  // ── Per-truck breakdown ────────────────────────────────────────────────
  const truckBuckets = new Map<
    string,
    { truckId: string; registrationNumber: string; cost: number; litres: number; distanceKm: number }
  >();

  for (const fuelEntry of fuelLogs) {
    const session = sessionById.get(fuelEntry.vehicleSessionId);
    if (!session) continue;

    const truck = truckById.get(session.truckId);
    if (!truck) continue;

    if (!truckBuckets.has(truck.id)) {
      truckBuckets.set(truck.id, {
        truckId: truck.id,
        registrationNumber: truck.registrationNumber,
        cost: 0,
        litres: 0,
        distanceKm: 0,
      });
    }
    const bucket = truckBuckets.get(truck.id)!;
    bucket.cost += fuelEntry.cost;
    bucket.litres += fuelEntry.liters;
  }

  // Add per-truck distance from trips
  for (const trip of trips) {
    const session = sessionById.get(trip.vehicleSessionId);
    if (!session) continue;
    const bucket = truckBuckets.get(session.truckId);
    if (bucket) {
      bucket.distanceKm += trip.endOdometer - trip.startOdometer;
    }
  }

  const perTruck = [...truckBuckets.values()]
    .sort((a, b) => b.cost - a.cost)
    .map(({ truckId, registrationNumber, cost, litres, distanceKm }) => ({
      truckId,
      registrationNumber,
      totalCost: parseFloat(cost.toFixed(2)),
      totalLitres: parseFloat(litres.toFixed(2)),
      efficiency:
        litres > 0 && distanceKm > 0
          ? parseFloat((distanceKm / litres).toFixed(2))
          : null,
    }));

  return {
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalLitres: parseFloat(totalLitres.toFixed(2)),
    overallEfficiency,
    costPerKm,
    perTruck,
  };
}

// ─── 2. Fleet Utilization Rate ────────────────────────────────────────────────

/**
 * Computes all fleet utilization metrics from live status data.
 *
 * Formula definitions:
 *   activeUtilizationRate  = (deployedTrucks / activeTrucks) × 100
 *   fleetUtilizationRate   = (deployedTrucks / totalTrucks)  × 100
 *   availabilityRate       = ((activeTrucks - deployedTrucks) / totalTrucks) × 100
 *
 * SQL equivalent:
 * ```sql
 * SELECT
 *   COUNT(*) FILTER (WHERE status = 'ACTIVE')         AS active_trucks,
 *   COUNT(*) FILTER (WHERE status = 'IN_MAINTENANCE') AS maintenance_trucks,
 *   COUNT(*) FILTER (WHERE status = 'RETIRED')        AS retired_trucks,
 *   COUNT(*)                                          AS total_trucks
 * FROM trucks;
 *
 * SELECT COUNT(DISTINCT truck_id) AS deployed_trucks
 * FROM vehicle_sessions
 * WHERE status = 'OPEN';
 * ```
 */
export function computeFleetUtilization(
  trucks: DemoTruck[],
  sessions: DemoVehicleSession[]
): FleetUtilization {
  const activeTrucks = trucks.filter((t) => t.status === "ACTIVE").length;
  const maintenanceTrucks = trucks.filter((t) => t.status === "IN_MAINTENANCE").length;
  const retiredTrucks = trucks.filter((t) => t.status === "RETIRED").length;
  const totalTrucks = trucks.length;

  // Count unique trucks with an OPEN session
  const deployedTruckIds = new Set(
    sessions.filter((s) => s.status === "OPEN").map((s) => s.truckId)
  );
  const deployedTrucks = deployedTruckIds.size;

  const pct = (numerator: number, denominator: number): number =>
    denominator === 0 ? 0 : parseFloat(((numerator / denominator) * 100).toFixed(1));

  return {
    activeTrucks,
    deployedTrucks,
    maintenanceTrucks,
    retiredTrucks,
    totalTrucks,
    activeUtilizationRate: pct(deployedTrucks, activeTrucks),
    fleetUtilizationRate: pct(deployedTrucks, totalTrucks),
    availabilityRate: pct(activeTrucks - deployedTrucks, totalTrucks),
  };
}

// ─── 3. Trip Distance Aggregation ────────────────────────────────────────────

/**
 * Aggregates trip statistics for a given set of trips.
 * Can be filtered upstream (e.g., by truck or driver) before calling.
 *
 * SQL equivalent:
 * ```sql
 * SELECT
 *   COUNT(*)                                  AS total_trips,
 *   SUM(end_odometer - start_odometer)        AS total_distance_km,
 *   AVG(end_odometer - start_odometer)        AS avg_distance_km,
 *   MAX(end_odometer - start_odometer)        AS longest_trip_km,
 *   MIN(end_odometer - start_odometer)        AS shortest_trip_km
 * FROM trips;
 * ```
 */
export function aggregateTrips(trips: DemoTrip[]): TripAggregation {
  if (trips.length === 0) {
    return {
      totalTrips: 0,
      totalDistanceKm: 0,
      averageDistanceKm: 0,
      longestTripKm: 0,
      shortestTripKm: 0,
    };
  }

  const distances = trips.map((t) => t.endOdometer - t.startOdometer);
  const totalDistanceKm = distances.reduce((s, d) => s + d, 0);

  return {
    totalTrips: trips.length,
    totalDistanceKm,
    averageDistanceKm: parseFloat((totalDistanceKm / trips.length).toFixed(1)),
    longestTripKm: Math.max(...distances),
    shortestTripKm: Math.min(...distances),
  };
}

// ─── 4. Formatting helpers ────────────────────────────────────────────────────

/** Format a monetary amount in Indian locale with ₹ symbol. */
export const formatINR = (amount: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;

/** Format a km value with Indian locale. */
export const formatKm = (km: number) =>
  `${new Intl.NumberFormat("en-IN").format(Math.round(km))} km`;

/** Format a utilization rate as a coloured badge label. */
export function utilizationLabel(rate: number): {
  label: string;
  color: "green" | "amber" | "red";
} {
  if (rate >= 70) return { label: `${rate}%`, color: "green" };
  if (rate >= 35) return { label: `${rate}%`, color: "amber" };
  return { label: `${rate}%`, color: "red" };
}
