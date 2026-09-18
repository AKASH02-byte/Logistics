import { PieChart } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Reports", eyebrow: "Insights", description: "Use clear operational snapshots to understand utilization, cost, and service performance.", icon: PieChart, accent: "from-fuchsia-500 to-pink-500", stats: [{ label: "Reports ready", value: "24", detail: "This period" }, { label: "Fleet utilization", value: "82.6%", detail: "+3.1% vs August" }, { label: "Cost per km", value: "₹18.40", detail: "Rolling average" }, { label: "Data freshness", value: "2 min", detail: "Last refresh" }], columns: ["Report", "Owner", "Period", "Updated"], rows: [{ cells: ["Fleet utilization", "Operations", "September 2026", "2 min ago"], status: { label: "Ready", tone: "green" } }, { cells: ["Cost & margin", "Finance", "September 2026", "Today, 08:20"], status: { label: "Ready", tone: "green" } }, { cells: ["Driver performance", "HR & Ops", "Q3 2026", "Yesterday"], status: { label: "Draft", tone: "amber" } }] }} />;
}
