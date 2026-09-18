import { Wrench } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Maintenance", eyebrow: "Fleet health", description: "Plan service work, control workshop spend, and keep trucks ready for their next route.", icon: Wrench, accent: "from-orange-500 to-red-500", stats: [{ label: "Open work orders", value: "07", detail: "2 urgent" }, { label: "In workshop", value: "03", detail: "Of 10 trucks" }, { label: "Due this week", value: "05", detail: "Preventive service" }, { label: "Monthly spend", value: "₹2.16L", detail: "-6.2% vs August" }], columns: ["Work order", "Truck", "Service", "Due"], rows: [{ cells: ["WO-1042", "KA05IJ1122", "Brake inspection", "Today"], status: { label: "Urgent", tone: "red" } }, { cells: ["WO-1041", "KA02CD1122", "Oil & filters", "18 Sep 2026"], status: { label: "Scheduled", tone: "amber" } }, { cells: ["WO-1038", "KA01AB1234", "Tyre rotation", "20 Sep 2026"], status: { label: "Planned", tone: "slate" } }] }} />;
}
