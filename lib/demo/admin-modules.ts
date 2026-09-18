import type { AdminModuleConfig } from "@/components/admin/AdminModulePage";
import { demoStore } from "./store";

const seedRows: Record<string, AdminModuleConfig["rows"]> = {
  Expenses: [
    { cells: ["Diesel advance", "Ravi Kumar", "17 Sep 2026", "₹18,500"], status: { label: "Approved", tone: "green" } },
    { cells: ["Toll & permits", "Suresh Reddy", "16 Sep 2026", "₹6,240"], status: { label: "Review", tone: "amber" } },
    { cells: ["Workshop supplies", "Fleet team", "15 Sep 2026", "₹24,800"], status: { label: "Approved", tone: "green" } },
  ],
  Maintenance: [
    { cells: ["WO-1042", "KA05IJ1122", "Brake inspection", "Today"], status: { label: "Urgent", tone: "red" } },
    { cells: ["WO-1041", "KA02CD1122", "Oil & filters", "18 Sep 2026"], status: { label: "Scheduled", tone: "amber" } },
    { cells: ["WO-1038", "KA01AB1234", "Tyre rotation", "20 Sep 2026"], status: { label: "Planned", tone: "slate" } },
  ],
  Invoices: [
    { cells: ["INV-2026-084", "Apex Manufacturing", "12 Sep 2026", "₹1,84,600"], status: { label: "Due soon", tone: "amber" } },
    { cells: ["INV-2026-083", "Northstar Retail", "10 Sep 2026", "₹2,42,000"], status: { label: "Sent", tone: "slate" } },
    { cells: ["INV-2026-082", "Vertex Infra", "05 Sep 2026", "₹96,400"], status: { label: "Paid", tone: "green" } },
  ],
  Payments: [
    { cells: ["PAY-7781", "Ravi Fuel Station", "Bank transfer", "₹48,200"], status: { label: "Completed", tone: "green" } },
    { cells: ["PAY-7780", "Metro Workshop", "UPI", "₹72,800"], status: { label: "Processing", tone: "amber" } },
    { cells: ["PAY-7779", "RoadLink Insurance", "Bank transfer", "₹1,24,000"], status: { label: "Completed", tone: "green" } },
  ],
  Accounts: [
    { cells: ["HDFC Operations", "Bank", "Today, 09:42", "₹8,42,600"], status: { label: "Healthy", tone: "green" } },
    { cells: ["Petty cash", "Cash", "Yesterday", "₹42,800"], status: { label: "Reconcile", tone: "amber" } },
    { cells: ["Fuel wallet", "Prepaid", "16 Sep 2026", "₹3,18,400"], status: { label: "Healthy", tone: "green" } },
  ],
  Customers: [
    { cells: ["Apex Manufacturing", "Bengaluru → Pune", "24", "₹6.8L"], status: { label: "Active", tone: "green" } },
    { cells: ["Northstar Retail", "Chennai → Hyderabad", "18", "₹4.2L"], status: { label: "Active", tone: "green" } },
    { cells: ["Vertex Infra", "Mysuru → Mumbai", "09", "₹2.9L"], status: { label: "Follow up", tone: "amber" } },
  ],
  Vendors: [
    { cells: ["Metro Workshop", "Maintenance", "₹72,800", "4.8 / 5"], status: { label: "Preferred", tone: "green" } },
    { cells: ["Ravi Fuel Station", "Fuel", "₹48,200", "4.5 / 5"], status: { label: "Active", tone: "green" } },
    { cells: ["RoadLink Insurance", "Insurance", "₹1,24,000", "4.2 / 5"], status: { label: "Renewal due", tone: "amber" } },
  ],
  Projects: [
    { cells: ["Apex Q3 distribution", "Apex Manufacturing", "12 trucks", "30 Sep 2026"], status: { label: "On track", tone: "green" } },
    { cells: ["South corridor", "Northstar Retail", "08 trucks", "15 Oct 2026"], status: { label: "At risk", tone: "red" } },
    { cells: ["Infra phase 2", "Vertex Infra", "06 trucks", "02 Nov 2026"], status: { label: "On track", tone: "green" } },
  ],
  Tenders: [
    { cells: ["TN-2026-019", "State Logistics", "19 Sep 2026", "₹8.4L"], status: { label: "Preparing", tone: "amber" } },
    { cells: ["TN-2026-017", "Apex Manufacturing", "24 Sep 2026", "₹12.2L"], status: { label: "Submitted", tone: "green" } },
    { cells: ["TN-2026-014", "City Infra", "02 Oct 2026", "₹6.8L"], status: { label: "Open", tone: "slate" } },
  ],
  Tyres: [
    { cells: ["TY-2048", "KA01AB1234", "Rear axle", "61,240 km"], status: { label: "Healthy", tone: "green" } },
    { cells: ["TY-2036", "KA03EF5566", "Front axle", "72,880 km"], status: { label: "Replace soon", tone: "amber" } },
    { cells: ["TY-2021", "KA05IJ1122", "Rear axle", "84,120 km"], status: { label: "Replace", tone: "red" } },
  ],
  Reports: [
    { cells: ["Fleet utilization", "Operations", "September 2026", "2 min ago"], status: { label: "Ready", tone: "green" } },
    { cells: ["Cost & margin", "Finance", "September 2026", "Today, 08:20"], status: { label: "Ready", tone: "green" } },
    { cells: ["Driver performance", "HR & Ops", "Q3 2026", "Yesterday"], status: { label: "Draft", tone: "amber" } },
  ],
  "Audit Logs": [
    { cells: ["Approved expense", "Business Owner", "09:42 today", "EXP-0048"], status: { label: "Recorded", tone: "green" } },
    { cells: ["Updated truck status", "Business Owner", "08:16 today", "KA05IJ1122"], status: { label: "Recorded", tone: "green" } },
    { cells: ["Failed login", "Unknown", "Yesterday", "Admin portal"], status: { label: "Flagged", tone: "red" } },
  ],
  Notifications: [
    { cells: ["Brake service overdue", "Operations", "10 min ago", "In-app + email"], status: { label: "Critical", tone: "red" } },
    { cells: ["Tender closing soon", "Business team", "1 hour ago", "In-app"], status: { label: "Unread", tone: "amber" } },
    { cells: ["Payment processed", "Finance", "Yesterday", "Email"], status: { label: "Read", tone: "green" } },
  ],
  "User & Role Management": [
    { cells: ["Business Owner", "Super admin", "Just now", "All modules"], status: { label: "Active", tone: "green" } },
    { cells: ["Anita Rao", "Finance", "Today, 08:54", "Finance"], status: { label: "Active", tone: "green" } },
    { cells: ["Kiran Das", "Operations", "Yesterday", "Fleet + trips"], status: { label: "Invite pending", tone: "amber" } },
  ],
};

export function getLiveModuleConfig(config: AdminModuleConfig): AdminModuleConfig {
  const rows = seedRows[config.title] ?? config.rows;
  const liveRows = config.title === "Maintenance"
    ? rows.map((row, index) => index === 0 && demoStore.trucks.some((truck) => truck.status === "IN_MAINTENANCE")
      ? { ...row, cells: [row.cells[0], demoStore.trucks.find((truck) => truck.status === "IN_MAINTENANCE")?.registrationNumber ?? row.cells[1], ...row.cells.slice(2)] }
      : row)
    : rows;

  return {
    ...config,
    rows: liveRows,
    stats: config.stats.map((stat) =>
      config.title === "Maintenance" && stat.label === "In workshop"
        ? { ...stat, value: String(demoStore.trucks.filter((truck) => truck.status === "IN_MAINTENANCE").length).padStart(2, "0") }
        : stat
    ),
  };
}
