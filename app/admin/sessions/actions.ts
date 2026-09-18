"use server";

import { closeVehicleSession } from "@/lib/demo/store";
import { revalidatePath } from "next/cache";

export async function forceCloseSession(labourId: string, closingOdometer: number) {
  closeVehicleSession(labourId, closingOdometer);
  revalidatePath("/admin/sessions");
}
