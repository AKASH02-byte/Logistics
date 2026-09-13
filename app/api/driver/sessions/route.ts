import {
  findTruckById,
  getOpenSessionForLabour,
  openVehicleSession,
} from "@/lib/demo/store";
import { requireLabourSession } from "@/lib/rbac/labour";
import { openSessionSchema } from "@/lib/validation/vehicle-session";
import { jsonOk, jsonError, toErrorResponse } from "@/lib/api/response";

export async function GET() {
  try {
    const labour = await requireLabourSession();
    const session = getOpenSessionForLabour(labour.id);
    if (!session) return jsonOk(null);

    const truck = findTruckById(session.truckId);
    return jsonOk({ ...session, truck });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(request: Request) {
  try {
    const labour = await requireLabourSession();
    const body = openSessionSchema.parse(await request.json());

    if (getOpenSessionForLabour(labour.id)) {
      return jsonError(409, "SESSION_ALREADY_OPEN", "You already have an open session today");
    }

    const truck = findTruckById(body.truckId);
    if (!truck || truck.status !== "ACTIVE") {
      return jsonError(404, "TRUCK_UNAVAILABLE", "This truck is not available");
    }

    const session = openVehicleSession(labour.id, truck.id);
    return jsonOk(session, 201);
  } catch (err) {
    return toErrorResponse(err);
  }
}
