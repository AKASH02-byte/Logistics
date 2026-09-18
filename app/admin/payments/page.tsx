import { CreditCard } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Payments", eyebrow: "Finance", description: "See outgoing payments, settlement status, and the next actions for your finance team.", icon: CreditCard, accent: "from-emerald-500 to-teal-500", stats: [{ label: "Processed", value: "₹18.2L", detail: "This month" }, { label: "Pending", value: "₹3.1L", detail: "14 payments" }, { label: "Failed", value: "02", detail: "Needs attention" }, { label: "Success rate", value: "98.6%", detail: "Last 90 days" }], columns: ["Payment", "Payee", "Method", "Amount"], rows: [{ cells: ["PAY-7781", "Ravi Fuel Station", "Bank transfer", "₹48,200"], status: { label: "Completed", tone: "green" } }, { cells: ["PAY-7780", "Metro Workshop", "UPI", "₹72,800"], status: { label: "Processing", tone: "amber" } }, { cells: ["PAY-7779", "RoadLink Insurance", "Bank transfer", "₹1,24,000"], status: { label: "Completed", tone: "green" } }] }} />;
}
