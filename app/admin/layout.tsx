import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { resolveAdminIdentity } from "@/lib/rbac/permissions";
import { AdminShell } from "@/components/layout/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const identity = await resolveAdminIdentity();

  if (!identity) {
    redirect("/login");
  }

  if (identity.status !== "ACTIVE") {
    redirect("/admin/pending-approval");
  }

  return <AdminShell user={identity}>{children}</AdminShell>;
}
