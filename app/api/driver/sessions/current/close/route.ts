import { closeVehicleSession, getOpenSessionForLabour } from "@/lib/demo/store";
import { requireLabourSession } from "@/lib/rbac/labour";
import { closeSessionSchema } from "@/lib/validation/vehicle-session";
import { jsonOk, jsonError, toErrorResponse } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const labour = await requireLabourSession();
    const body = closeSessionSchema.parse(await request.json());

    const openSession = getOpenSessionForLabour(labour.id);
    if (!openSession) {
      return jsonError(404, "NO_OPEN_SESSION", "You have no open session to close");
    }

    if (body.closingOdometer < openSession.openingOdometer) {
      return jsonError(
        400,
        "INVALID_ODOMETER",
        "Closing odometer cannot be less than the opening odometer"
      );
    }

    const updated = closeVehicleSession(labour.id, body.closingOdometer);
    return jsonOk(updated);
  } catch (err) {
    return toErrorResponse(err);
  }
}
