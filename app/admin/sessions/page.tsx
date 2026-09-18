import { demoStore } from "@/lib/demo/store";
import { SessionsClient } from "./SessionsClient";

export default async function SessionsPage() {
  const sessions = [...demoStore.vehicleSessions];
  const trucks = [...demoStore.trucks];
  const drivers = [...demoStore.labours];
  
  return <SessionsClient sessions={sessions} trucks={trucks} drivers={drivers} />;
}
