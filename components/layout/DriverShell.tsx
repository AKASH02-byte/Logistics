import type { ReactNode } from "react";
import type { LabourRow } from "@/types/database";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function DriverShell({ labour, children }: { labour: LabourRow; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f242b_0%,_#14181d_38%,_#0f1217_100%)] text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/agk-logo.svg" alt="AGK Logistics & Infrastructure" className="h-9 w-14 rounded-lg object-cover object-left" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400/80">
                AGK Logistics
              </p>
              <span className="mt-1 block text-base font-bold text-white">Driver Console</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 pl-2 shadow-lg shadow-slate-950/20 sm:gap-3 sm:rounded-full sm:pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-300">
              {labour.full_name?.charAt(0)?.toUpperCase() ?? "D"}
            </div>
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-semibold text-white">{labour.full_name}</div>
              <div className="text-[11px] text-slate-300">{labour.labour_code}</div>
            </div>
            <LogoutButton endpoint="/api/driver/logout" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}
