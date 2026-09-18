import { FileText } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Tenders", eyebrow: "Business", description: "Track opportunities from submission through award and keep every bid deadline visible.", icon: FileText, accent: "from-sky-500 to-cyan-500", stats: [{ label: "Open tenders", value: "09", detail: "3 closing this week" }, { label: "Submitted", value: "14", detail: "This quarter" }, { label: "Win rate", value: "31%", detail: "Rolling 12 months" }, { label: "Pipeline value", value: "₹42.8L", detail: "Open opportunities" }], columns: ["Tender", "Customer", "Closing", "Value"], rows: [{ cells: ["TN-2026-019", "State Logistics", "19 Sep 2026", "₹8.4L"], status: { label: "Preparing", tone: "amber" } }, { cells: ["TN-2026-017", "Apex Manufacturing", "24 Sep 2026", "₹12.2L"], status: { label: "Submitted", tone: "green" } }, { cells: ["TN-2026-014", "City Infra", "02 Oct 2026", "₹6.8L"], status: { label: "Open", tone: "slate" } }] }} />;
}
