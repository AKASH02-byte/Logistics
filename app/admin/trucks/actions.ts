"use server";

import { demoStore, DemoTruck } from "@/lib/demo/store";
import { revalidatePath } from "next/cache";

export async function addTruck(data: Omit<DemoTruck, "id">) {
  const newTruck: DemoTruck = {
    ...data,
    id: `t${Date.now()}`,
  };
  demoStore.trucks.push(newTruck);
  revalidatePath("/admin/trucks");
}

export async function updateTruck(id: string, data: Partial<Omit<DemoTruck, "id">>) {
  const idx = demoStore.trucks.findIndex((t) => t.id === id);
  if (idx > -1) {
    demoStore.trucks[idx] = { ...demoStore.trucks[idx], ...data };
    revalidatePath("/admin/trucks");
  }
}

export async function deleteTruck(id: string) {
  const idx = demoStore.trucks.findIndex((t) => t.id === id);
  if (idx > -1) {
    demoStore.trucks.splice(idx, 1);
    revalidatePath("/admin/trucks");
  }
}
