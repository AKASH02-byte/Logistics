"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Footer } from "@/components/layout/Footer";
import {
  LayoutDashboard, Truck, Users, Clock, Map, Fuel,
  Receipt, Wrench, CircleDot, Users2, Building2,
  Briefcase, FileText, FileSpreadsheet, CreditCard,
  Landmark, PieChart, Settings, ChevronRight,
} from "lucide-react";

interface AdminShellUser {
  full_name: string;
  role: string;
}

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Fleet",
    items: [
      { href: "/admin/trucks", label: "Trucks", icon: Truck },
      { href: "/admin/drivers", label: "Drivers", icon: Users },
      { href: "/admin/sessions", label: "Sessions", icon: Clock },
      { href: "/admin/trips", label: "Trips", icon: Map },
      { href: "/admin/fuel", label: "Fuel", icon: Fuel },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/admin/expenses", label: "Expenses", icon: Receipt },
      { href: "/admin/maintenance", label: "Maintenance", icon: Wrench },
      { href: "/admin/tyres", label: "Tyres", icon: CircleDot },
      { href: "/admin/invoices", label: "Invoices", icon: FileSpreadsheet },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
      { href: "/admin/accounts", label: "Accounts", icon: Landmark },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/admin/customers", label: "Customers", icon: Users2 },
      { href: "/admin/vendors", label: "Vendors", icon: Building2 },
      { href: "/admin/projects", label: "Projects", icon: Briefcase },
      { href: "/admin/tenders", label: "Tenders", icon: FileText },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/admin/reports", label: "Reports", icon: PieChart },
      { href: "/admin/settings/users", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminShell({ user, children }: { user: AdminShellUser; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh bg-gray-50/40">

      {/* ─── Sidebar ──────────────────────────────────────── */}
      <nav className="w-60 shrink-0 flex flex-col bg-gray-950 border-r border-white/5 relative z-10">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src="/agk-logo.svg" alt="AGK Logistics & Infrastructure" className="h-10 w-14 rounded-lg object-cover object-left" />
            <div>
              <div className="font-black text-white tracking-tight text-base leading-none">AGK Logistics</div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-0.5">ERP</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 px-3 scrollbar-none">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-2 mb-1.5">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href} className="relative">
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-amber-500/10 rounded-xl border border-amber-500/20"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <Link
                        href={item.href}
                        className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors z-10 ${
                          isActive
                            ? "text-amber-400"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-gray-500"}`} />
                        <span className="flex-1">{item.label}</span>
                        {isActive && <ChevronRight className="w-3 h-3 text-amber-500/60" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* User avatar at bottom */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-sm shadow-inner shrink-0">
              {user.full_name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-200 truncate">{user.full_name}</div>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{user.role.replace("_", " ")}</div>
            </div>
          </div>
          <div className="mt-4">
            <LogoutButton endpoint="/api/admin/logout" />
          </div>
        </div>
      </nav>

      {/* ─── Main content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky header */}
        <header className="sticky top-0 z-20 h-14 flex items-center px-8 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-2 ml-auto">
            <div className="text-right mr-2">
              <div className="text-[13px] font-semibold text-gray-800">{user.full_name}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">{user.role.replace("_", " ")}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.full_name.charAt(0)}
            </div>
            <LogoutButton endpoint="/api/admin/logout" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 overflow-x-hidden">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
