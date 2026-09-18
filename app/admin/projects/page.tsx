import { Briefcase } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Projects", eyebrow: "Business", description: "Coordinate long-running contracts, assigned fleet capacity, and delivery performance.", icon: Briefcase, accent: "from-blue-500 to-indigo-500", stats: [{ label: "Active projects", value: "12", detail: "Across 6 customers" }, { label: "Fleet assigned", value: "28", detail: "Of 42 active trucks" }, { label: "At risk", value: "02", detail: "Needs review" }, { label: "Utilization", value: "78.4%", detail: "Project capacity" }], columns: ["Project", "Customer", "Fleet", "End date"], rows: [{ cells: ["Apex Q3 distribution", "Apex Manufacturing", "12 trucks", "30 Sep 2026"], status: { label: "On track", tone: "green" } }, { cells: ["South corridor", "Northstar Retail", "08 trucks", "15 Oct 2026"], status: { label: "At risk", tone: "red" } }, { cells: ["Infra phase 2", "Vertex Infra", "06 trucks", "02 Nov 2026"], status: { label: "On track", tone: "green" } }] }} />;
}
