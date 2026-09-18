"use server";

import { demoStore, DemoLabour } from "@/lib/demo/store";
import { revalidatePath } from "next/cache";

function generateLoginKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${part()}-${part()}-${part().substring(0, 2)}`;
}

export async function addDriver(data: Omit<DemoLabour, "id" | "loginKey" | "labourCode">) {
  const newCode = `LAB${String(demoStore.labours.length + 1).padStart(3, "0")}`;
  
  const newDriver: DemoLabour = {
    ...data,
    id: `l${Date.now()}`,
    labourCode: newCode,
    loginKey: generateLoginKey(),
  };
  demoStore.labours.push(newDriver);
  revalidatePath("/admin/drivers");
}

export async function updateDriver(id: string, data: Partial<Omit<DemoLabour, "id" | "labourCode" | "loginKey">>) {
  const idx = demoStore.labours.findIndex((l) => l.id === id);
  if (idx > -1) {
    demoStore.labours[idx] = { ...demoStore.labours[idx], ...data };
    revalidatePath("/admin/drivers");
  }
}

export async function resetLoginKey(id: string) {
  const idx = demoStore.labours.findIndex((l) => l.id === id);
  if (idx > -1) {
    demoStore.labours[idx].loginKey = generateLoginKey();
    revalidatePath("/admin/drivers");
  }
}

export async function deleteDriver(id: string) {
  const idx = demoStore.labours.findIndex((l) => l.id === id);
  if (idx > -1) {
    demoStore.labours.splice(idx, 1);
    revalidatePath("/admin/drivers");
  }
}
