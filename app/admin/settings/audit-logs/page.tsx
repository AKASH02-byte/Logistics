import { ClipboardList } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Audit Logs", eyebrow: "Settings", description: "Review important changes across accounts, approvals, and fleet operations.", icon: ClipboardList, accent: "from-slate-500 to-slate-700", stats: [{ label: "Events today", value: "184", detail: "Across all users" }, { label: "Admin actions", value: "42", detail: "This week" }, { label: "Flagged", value: "03", detail: "Needs review" }, { label: "Retention", value: "90 days", detail: "Current policy" }], columns: ["Event", "Actor", "Time", "Resource"], rows: [{ cells: ["Approved expense", "Business Owner", "09:42 today", "EXP-0048"], status: { label: "Recorded", tone: "green" } }, { cells: ["Updated truck status", "Business Owner", "08:16 today", "KA05IJ1122"], status: { label: "Recorded", tone: "green" } }, { cells: ["Failed login", "Unknown", "Yesterday", "Admin portal"], status: { label: "Flagged", tone: "red" } }] }} />;
}
