import { CircleDot } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Tyres", eyebrow: "Fleet health", description: "Monitor tyre life, replacements, and safety checks across every vehicle.", icon: CircleDot, accent: "from-lime-500 to-emerald-500", stats: [{ label: "Tyres in service", value: "74", detail: "Across 10 trucks" }, { label: "Replacement due", value: "08", detail: "Within 30 days" }, { label: "Avg. life", value: "68,400 km", detail: "Current fleet" }, { label: "Stock value", value: "₹6.2L", detail: "Warehouse inventory" }], columns: ["Tyre set", "Truck", "Position", "Mileage"], rows: [{ cells: ["TY-2048", "KA01AB1234", "Rear axle", "61,240 km"], status: { label: "Healthy", tone: "green" } }, { cells: ["TY-2036", "KA03EF5566", "Front axle", "72,880 km"], status: { label: "Replace soon", tone: "amber" } }, { cells: ["TY-2021", "KA05IJ1122", "Rear axle", "84,120 km"], status: { label: "Replace", tone: "red" } }] }} />;
}
