import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { requireLabourSession } from "@/lib/rbac/labour";
import { DriverShell } from "@/components/layout/DriverShell";
import { UnauthorizedError } from "@/lib/rbac/errors";

async function resolveLabourOrRedirect() {
  try {
    return await requireLabourSession();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      redirect("/login");
    }
    throw err;
  }
}

export default async function DriverLayout({ children }: { children: ReactNode }) {
  const labour = await resolveLabourOrRedirect();
  return <DriverShell labour={labour}>{children}</DriverShell>;
}
