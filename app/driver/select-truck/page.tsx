import { redirect } from "next/navigation";
import { getAvailableTrucks, getOpenSessionForLabour } from "@/lib/demo/store";
import { requireLabourSession } from "@/lib/rbac/labour";
import { TruckPicker } from "./TruckPicker";

export default async function SelectTruckPage() {
  const labour = await requireLabourSession();

  if (getOpenSessionForLabour(labour.id)) {
    redirect("/driver/dashboard");
  }

  const trucks = getAvailableTrucks().map((t) => ({
    id: t.id,
    registration_number: t.registrationNumber,
    make: t.make,
    model: t.model,
    current_odometer: String(t.currentOdometer),
  }));

  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        Select today&rsquo;s truck
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "1.25rem" }}>
        Welcome, {labour.full_name}. Pick the truck you&rsquo;re driving today.
      </p>
      <TruckPicker trucks={trucks} />
    </div>
  );
}
