import { demoStore } from "@/lib/demo/store";
import { DriversClient } from "./DriversClient";

export default async function DriversPage() {
  // In demo mode, fetch from the global store
  const drivers = [...demoStore.labours];
  
  return <DriversClient initialDrivers={drivers} />;
}
