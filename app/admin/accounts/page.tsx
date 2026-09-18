import { Landmark } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Accounts", eyebrow: "Finance", description: "Monitor cash movement, balances, and ledger health across the operation.", icon: Landmark, accent: "from-cyan-500 to-blue-500", stats: [{ label: "Cash balance", value: "₹12.6L", detail: "Across 4 accounts" }, { label: "Receivables", value: "₹8.4L", detail: "Due this month" }, { label: "Payables", value: "₹3.1L", detail: "Due this month" }, { label: "Reconciled", value: "96%", detail: "Current period" }], columns: ["Account", "Type", "Last activity", "Balance"], rows: [{ cells: ["HDFC Operations", "Bank", "Today, 09:42", "₹8,42,600"], status: { label: "Healthy", tone: "green" } }, { cells: ["Petty cash", "Cash", "Yesterday", "₹42,800"], status: { label: "Reconcile", tone: "amber" } }, { cells: ["Fuel wallet", "Prepaid", "16 Sep 2026", "₹3,18,400"], status: { label: "Healthy", tone: "green" } }] }} />;
}
