/**
 * TEMPORARY DEMO DATA STORE — no database.
 *
 * This replaces the Supabase-backed persistence layer described in
 * docs/DATABASE.md/docs/ARCHITECTURE.md with hardcoded, in-memory data so
 * the app is runnable locally with zero external setup. This is explicitly
 * a step backward from the project's own stated rules ("labour credentials
 * are never hardcoded", Postgres/Supabase as required technology) — see
 * docs/DEVELOPMENT_PLAN.md for the note on reverting this once a Supabase
 * project is available.
 *
 * State lives on `globalThis` so it survives Next.js dev server Fast
 * Refresh module reloads. It does NOT survive a process restart, and does
 * NOT work across multiple server instances — fine for a single local dev
 * server, not fine for anything beyond that.
 */

export interface DemoAdmin {
  adminId: string;
  password: string;
  fullName: string;
  role: "SUPER_ADMIN";
}

export interface DemoLabour {
  id: string;
  labourCode: string;
  loginKey: string;
  fullName: string;
  phone: string;
  status: "ACTIVE" | "SUSPENDED";
}

export interface DemoTruck {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  status: "ACTIVE" | "IN_MAINTENANCE" | "RETIRED";
  currentOdometer: number;
}

export interface DemoVehicleSession {
  id: string;
  labourId: string;
  truckId: string;
  status: "OPEN" | "CLOSED";
  openingOdometer: number;
  closingOdometer: number | null;
  openedAt: string;
  closedAt: string | null;
}

export interface DemoTrip {
  id: string;
  vehicleSessionId: string;
  startOdometer: number;
  endOdometer: number;
  fromLocation: string;
  toLocation: string;
  createdAt: string;
}

export interface DemoFuel {
  id: string;
  vehicleSessionId: string;
  odometer: number;
  liters: number;
  cost: number;
  createdAt: string;
}

interface DemoStore {
  admin: DemoAdmin;
  labours: DemoLabour[];
  trucks: DemoTruck[];
  vehicleSessions: DemoVehicleSession[];
  trips: DemoTrip[];
  fuelLogs: DemoFuel[];
}

const ADMIN: DemoAdmin = {
  adminId: "admin",
  password: "Admin@123",
  fullName: "Business Owner",
  role: "SUPER_ADMIN",
};

const LABOURS: DemoLabour[] = [
  { id: "l1", labourCode: "LAB001", loginKey: "7K4P-92MX-81", fullName: "Ravi Kumar", phone: "9900011001", status: "ACTIVE" },
  { id: "l2", labourCode: "LAB002", loginKey: "3H8Q-45TZ-19", fullName: "Suresh Reddy", phone: "9900011002", status: "ACTIVE" },
  { id: "l3", labourCode: "LAB003", loginKey: "9M2W-77LN-64", fullName: "Manoj Singh", phone: "9900011003", status: "ACTIVE" },
  { id: "l4", labourCode: "LAB004", loginKey: "5D6R-23KX-38", fullName: "Arjun Nair", phone: "9900011004", status: "ACTIVE" },
  { id: "l5", labourCode: "LAB005", loginKey: "8F4T-91PZ-27", fullName: "Vijay Patel", phone: "9900011005", status: "ACTIVE" },
  { id: "l6", labourCode: "LAB006", loginKey: "2N7Y-58HQ-93", fullName: "Sanjay Yadav", phone: "9900011006", status: "ACTIVE" },
  { id: "l7", labourCode: "LAB007", loginKey: "6C3M-84VX-15", fullName: "Deepak Sharma", phone: "9900011007", status: "ACTIVE" },
  { id: "l8", labourCode: "LAB008", loginKey: "4J9K-36RW-72", fullName: "Ramesh Gowda", phone: "9900011008", status: "ACTIVE" },
  { id: "l9", labourCode: "LAB009", loginKey: "1P5X-69NT-48", fullName: "Ashok Verma", phone: "9900011009", status: "ACTIVE" },
  { id: "l10", labourCode: "LAB010", loginKey: "7Q2Z-14MY-56", fullName: "Prakash Rao", phone: "9900011010", status: "ACTIVE" },
];

const TRUCKS: DemoTruck[] = [
  { id: "t1", registrationNumber: "KA01AB1234", make: "Tata", model: "Signa 4225", status: "ACTIVE", currentOdometer: 128450 },
  { id: "t2", registrationNumber: "KA01AB5678", make: "Ashok Leyland", model: "1616", status: "ACTIVE", currentOdometer: 96210 },
  { id: "t3", registrationNumber: "KA02CD1122", make: "BharatBenz", model: "1617R", status: "ACTIVE", currentOdometer: 154300 },
  { id: "t4", registrationNumber: "KA02CD3344", make: "Tata", model: "LPT 1613", status: "ACTIVE", currentOdometer: 87650 },
  { id: "t5", registrationNumber: "KA03EF5566", make: "Eicher", model: "Pro 3015", status: "ACTIVE", currentOdometer: 112900 },
  { id: "t6", registrationNumber: "KA03EF7788", make: "Ashok Leyland", model: "Ecomet 1615", status: "ACTIVE", currentOdometer: 65200 },
  { id: "t7", registrationNumber: "KA04GH9900", make: "Tata", model: "Signa 3118", status: "ACTIVE", currentOdometer: 143700 },
  { id: "t8", registrationNumber: "KA04GH1357", make: "Mahindra", model: "Blazo X 28", status: "ACTIVE", currentOdometer: 78100 },
  { id: "t9", registrationNumber: "KA05IJ2468", make: "BharatBenz", model: "1923C", status: "ACTIVE", currentOdometer: 101450 },
  { id: "t10", registrationNumber: "KA05IJ1122", make: "Tata", model: "Prima 2830", status: "IN_MAINTENANCE", currentOdometer: 189600 },
];

function createInitialStore(): DemoStore {
  return {
    admin: ADMIN,
    labours: LABOURS,
    trucks: TRUCKS,
    vehicleSessions: [],
    trips: [],
    fuelLogs: [],
  };
}

const globalForDemo = globalThis as unknown as { __demoStore?: DemoStore };

export const demoStore: DemoStore =
  globalForDemo.__demoStore ?? (globalForDemo.__demoStore = createInitialStore());

export function findLabourByCode(labourCode: string): DemoLabour | undefined {
  return demoStore.labours.find(
    (l) => l.labourCode.toUpperCase() === labourCode.toUpperCase()
  );
}

export function findLabourById(id: string): DemoLabour | undefined {
  return demoStore.labours.find((l) => l.id === id);
}

export function findTruckById(id: string): DemoTruck | undefined {
  return demoStore.trucks.find((t) => t.id === id);
}

export function getOpenSessionForLabour(labourId: string): DemoVehicleSession | undefined {
  return demoStore.vehicleSessions.find(
    (s) => s.labourId === labourId && s.status === "OPEN"
  );
}

export function getAvailableTrucks(): DemoTruck[] {
  const busyTruckIds = new Set(
    demoStore.vehicleSessions.filter((s) => s.status === "OPEN").map((s) => s.truckId)
  );
  return demoStore.trucks.filter((t) => t.status === "ACTIVE" && !busyTruckIds.has(t.id));
}

export function openVehicleSession(labourId: string, truckId: string): DemoVehicleSession {
  const truck = findTruckById(truckId);
  if (!truck) throw new Error("Truck not found");

  const session: DemoVehicleSession = {
    id: `vs-${Date.now()}`,
    labourId,
    truckId,
    status: "OPEN",
    openingOdometer: truck.currentOdometer,
    closingOdometer: null,
    openedAt: new Date().toISOString(),
    closedAt: null,
  };
  demoStore.vehicleSessions.push(session);
  return session;
}

export function closeVehicleSession(
  labourId: string,
  closingOdometer: number
): DemoVehicleSession | null {
  const session = getOpenSessionForLabour(labourId);
  if (!session) return null;

  session.status = "CLOSED";
  session.closingOdometer = closingOdometer;
  session.closedAt = new Date().toISOString();

  const truck = findTruckById(session.truckId);
  if (truck) truck.currentOdometer = closingOdometer;

  return session;
}

export function logTrip(data: Omit<DemoTrip, "id" | "createdAt">): DemoTrip {
  const trip = {
    ...data,
    id: `trip-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  demoStore.trips.push(trip);
  return trip;
}

export function logFuel(data: Omit<DemoFuel, "id" | "createdAt">): DemoFuel {
  const fuel = {
    ...data,
    id: `fuel-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  demoStore.fuelLogs.push(fuel);
  return fuel;
}
