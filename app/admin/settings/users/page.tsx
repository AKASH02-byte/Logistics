import { UserCog } from "lucide-react";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export default function Page() {
  return <AdminModulePage config={{ title: "User & Role Management", eyebrow: "Settings", description: "Manage access, responsibilities, and account status across the operations team.", icon: UserCog, accent: "from-purple-500 to-indigo-500", stats: [{ label: "Team members", value: "18", detail: "4 roles" }, { label: "Active users", value: "16", detail: "89% of team" }, { label: "Pending invites", value: "02", detail: "Awaiting signup" }, { label: "Roles", value: "04", detail: "Configured" }], columns: ["User", "Role", "Last active", "Access"], rows: [{ cells: ["Business Owner", "Super admin", "Just now", "All modules"], status: { label: "Active", tone: "green" } }, { cells: ["Anita Rao", "Finance", "Today, 08:54", "Finance"], status: { label: "Active", tone: "green" } }, { cells: ["Kiran Das", "Operations", "Yesterday", "Fleet + trips"], status: { label: "Invite pending", tone: "amber" } }] }} />;
}
