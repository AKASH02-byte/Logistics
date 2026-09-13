import { getAvailableTrucks } from "@/lib/demo/store";
import { requireLabourSession } from "@/lib/rbac/labour";
import { jsonOk, toErrorResponse } from "@/lib/api/response";

export async function GET() {
  try {
    await requireLabourSession();
    const trucks = getAvailableTrucks().map((t) => ({
      id: t.id,
      registration_number: t.registrationNumber,
      make: t.make,
      model: t.model,
      current_odometer: String(t.currentOdometer),
    }));
    return jsonOk(trucks);
  } catch (err) {
    return toErrorResponse(err);
  }
}
