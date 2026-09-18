import { demoStore } from "@/lib/demo/store";
import { DashboardClient } from "./DashboardClient";
import {
  aggregateFuelSpend,
  computeFleetUtilization,
  aggregateTrips,
} from "@/lib/analytics/fleet";

function getKpis() {
  const { trucks, vehicleSessions, trips, fuelLogs, labours } = demoStore;

  // ── Computed via validated analytics functions ────────────────────────
  const utilization = computeFleetUtilization(trucks, vehicleSessions);
  const fuel = aggregateFuelSpend(fuelLogs, vehicleSessions, trucks, trips);
  const tripStats = aggregateTrips(trips);

  const grossRevenue = Math.round(tripStats.totalDistanceKm * 42 + tripStats.totalTrips * 14500);
  const netMargin = Math.max(0, grossRevenue - fuel.totalCost - tripStats.totalTrips * 4800);
  const outstandingReceivables = Math.round(grossRevenue * 0.18);
  const projectPipelineValue = Math.round(grossRevenue * 0.62);
  const onTimeRate = Math.min(99, Math.max(82, Math.round(utilization.fleetUtilizationRate + 80)));

  return {
    // Fleet
    activeTrucks: utilization.activeTrucks,
    maintenanceTrucks: utilization.maintenanceTrucks,
    openSessions: utilization.deployedTrucks,
    // Utilization rates — all three flavours
    activeUtilizationRate: utilization.activeUtilizationRate,
    fleetUtilizationRate: utilization.fleetUtilizationRate,
    availabilityRate: utilization.availabilityRate,
    // Trips
    totalTrips: tripStats.totalTrips,
    totalDistanceKm: tripStats.totalDistanceKm,
    averageTripDistanceKm: tripStats.averageDistanceKm,
    // Fuel — live aggregation
    totalFuelCost: fuel.totalCost,
    totalFuelLitres: fuel.totalLitres,
    fuelEfficiency: fuel.overallEfficiency,
    // Finance / business
    grossRevenue,
    netMargin,
    outstandingReceivables,
    projectPipelineValue,
    onTimeRate,
    maintenanceAlerts: utilization.maintenanceTrucks + Math.max(1, Math.round(tripStats.totalTrips / 12)),
    // Labour
    totalLabours: labours.length,
    activeLabours: labours.filter((l) => l.status === "ACTIVE").length,
    recentTrips: [...demoStore.trips]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((t) => {
        const session = demoStore.vehicleSessions.find((s) => s.id === t.vehicleSessionId);
        const truck = demoStore.trucks.find((tr) => tr.id === session?.truckId);
        const driver = demoStore.labours.find((d) => d.id === session?.labourId);
        return {
          id: t.id,
          from: t.fromLocation,
          to: t.toLocation,
          distance: t.endOdometer - t.startOdometer,
          truck: truck?.registrationNumber ?? "—",
          driver: driver?.fullName ?? "—",
          createdAt: t.createdAt,
        };
      }),
    activeSessions: demoStore.vehicleSessions
      .filter((s) => s.status === "OPEN")
      .map((s) => {
        const truck = demoStore.trucks.find((t) => t.id === s.truckId);
        const driver = demoStore.labours.find((d) => d.id === s.labourId);
        return {
          id: s.id,
          truck: truck?.registrationNumber ?? "—",
          driver: driver?.fullName ?? "—",
          since: s.openedAt,
          odo: s.openingOdometer,
        };
      }),
  };
}

export default function AdminDashboardPage() {
  const kpis = getKpis();
  return <DashboardClient kpis={kpis} />;
}
