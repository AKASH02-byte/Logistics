"use server";

import { logFuel } from "@/lib/demo/store";
import { revalidatePath } from "next/cache";

export async function submitFuel(
  vehicleSessionId: string,
  odometer: number,
  liters: number,
  cost: number
) {
  logFuel({ vehicleSessionId, odometer, liters, cost });
  revalidatePath("/driver/dashboard");
  revalidatePath("/admin/fuel");
}
