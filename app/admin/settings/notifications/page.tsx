import { Bell } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "Notifications", eyebrow: "Settings", description: "See operational alerts and keep the right people informed at the right time.", icon: Bell, accent: "from-blue-500 to-violet-500", stats: [{ label: "Unread", value: "07", detail: "Across your workspace" }, { label: "Critical", value: "02", detail: "Requires action" }, { label: "Sent today", value: "38", detail: "Email and in-app" }, { label: "Delivery rate", value: "99.2%", detail: "Last 30 days" }], columns: ["Notification", "Audience", "Created", "Channel"], rows: [{ cells: ["Brake service overdue", "Operations", "10 min ago", "In-app + email"], status: { label: "Critical", tone: "red" } }, { cells: ["Tender closing soon", "Business team", "1 hour ago", "In-app"], status: { label: "Unread", tone: "amber" } }, { cells: ["Payment processed", "Finance", "Yesterday", "Email"], status: { label: "Read", tone: "green" } }] }} />;
}
