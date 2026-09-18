import { Users2 } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Customers", eyebrow: "Business", description: "Keep customer relationships, active lanes, and account performance visible to the whole team.", icon: Users2, accent: "from-violet-500 to-fuchsia-500", stats: [{ label: "Active customers", value: "38", detail: "+4 this quarter" }, { label: "Open orders", value: "126", detail: "Across 18 lanes" }, { label: "On-time rate", value: "94.8%", detail: "Last 30 days" }, { label: "Revenue", value: "₹28.4L", detail: "This quarter" }], columns: ["Customer", "Primary lane", "Open orders", "Revenue"], rows: [{ cells: ["Apex Manufacturing", "Bengaluru → Pune", "24", "₹6.8L"], status: { label: "Active", tone: "green" } }, { cells: ["Northstar Retail", "Chennai → Hyderabad", "18", "₹4.2L"], status: { label: "Active", tone: "green" } }, { cells: ["Vertex Infra", "Mysuru → Mumbai", "09", "₹2.9L"], status: { label: "Follow up", tone: "amber" } }] }} />;
}
