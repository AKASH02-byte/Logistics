import { Building2 } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Vendors", eyebrow: "Business", description: "Keep workshops, fuel partners, and service providers accountable to agreed terms.", icon: Building2, accent: "from-yellow-500 to-amber-500", stats: [{ label: "Active vendors", value: "26", detail: "Across 8 categories" }, { label: "Open bills", value: "₹3.1L", detail: "14 invoices" }, { label: "Avg. rating", value: "4.6/5", detail: "Last 90 days" }, { label: "Contracts due", value: "03", detail: "This quarter" }], columns: ["Vendor", "Category", "Open bills", "Rating"], rows: [{ cells: ["Metro Workshop", "Maintenance", "₹72,800", "4.8 / 5"], status: { label: "Preferred", tone: "green" } }, { cells: ["Ravi Fuel Station", "Fuel", "₹48,200", "4.5 / 5"], status: { label: "Active", tone: "green" } }, { cells: ["RoadLink Insurance", "Insurance", "₹1,24,000", "4.2 / 5"], status: { label: "Renewal due", tone: "amber" } }] }} />;
}
