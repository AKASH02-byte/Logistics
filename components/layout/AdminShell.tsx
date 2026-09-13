import type { ReactNode } from "react";

interface AdminShellUser {
  full_name: string;
  role: string;
}

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/trucks", label: "Trucks" },
  { href: "/admin/drivers", label: "Drivers" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/trips", label: "Trips" },
  { href: "/admin/fuel", label: "Fuel" },
  { href: "/admin/expenses", label: "Expenses" },
  { href: "/admin/maintenance", label: "Maintenance" },
  { href: "/admin/tyres", label: "Tyres" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/vendors", label: "Vendors" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/tenders", label: "Tenders" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/accounts", label: "Accounts" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings/users", label: "Settings" },
];

export function AdminShell({ user, children }: { user: AdminShellUser; children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      <nav
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: "1px solid #e5e7eb",
          padding: "1.5rem 1rem",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "1.5rem" }}>Fleet Operations</div>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.25rem" }}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                style={{
                  display: "block",
                  padding: "0.5rem 0.75rem",
                  borderRadius: 8,
                  fontSize: "0.9rem",
                  color: "#374151",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <span style={{ fontSize: "0.9rem", color: "#374151" }}>
            {user.full_name} · {user.role.replace("_", " ")}
          </span>
        </header>
        <main style={{ flex: 1, padding: "1.5rem" }}>{children}</main>
      </div>
    </div>
  );
}
