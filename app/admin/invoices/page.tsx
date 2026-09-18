import { FileSpreadsheet } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Invoices", eyebrow: "Finance", description: "Prepare, review, and follow up on customer invoices without losing track of due dates.", icon: FileSpreadsheet, accent: "from-amber-500 to-orange-500", stats: [{ label: "Outstanding", value: "₹8.4L", detail: "18 invoices" }, { label: "Due this week", value: "₹2.1L", detail: "5 invoices" }, { label: "Paid this month", value: "₹14.8L", detail: "42 invoices" }, { label: "Collection rate", value: "91.2%", detail: "Rolling 30 days" }], columns: ["Invoice", "Customer", "Issued", "Amount"], rows: [{ cells: ["INV-2026-084", "Apex Manufacturing", "12 Sep 2026", "₹1,84,600"], status: { label: "Due soon", tone: "amber" } }, { cells: ["INV-2026-083", "Northstar Retail", "10 Sep 2026", "₹2,42,000"], status: { label: "Sent", tone: "slate" } }, { cells: ["INV-2026-082", "Vertex Infra", "05 Sep 2026", "₹96,400"], status: { label: "Paid", tone: "green" } }] }} />;
}
