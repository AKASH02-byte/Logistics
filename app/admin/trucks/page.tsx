import { demoStore } from "@/lib/demo/store";
import { TrucksClient } from "./TrucksClient";

export default async function TrucksPage() {
  // In demo mode, fetch from the global store
  const trucks = [...demoStore.trucks];
  
  return <TrucksClient initialTrucks={trucks} />;
}
