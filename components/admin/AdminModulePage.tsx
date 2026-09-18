import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Search } from "lucide-react";
import { getLiveModuleConfig } from "@/lib/demo/admin-modules";

export interface AdminModuleConfig {
  title: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  stats: { label: string; value: string; detail: string }[];
  columns: string[];
  rows: { cells: string[]; status?: { label: string; tone: "green" | "amber" | "red" | "slate" } }[];
}

const STATUS_STYLES = {
  green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  red: "border-red-400/20 bg-red-400/10 text-red-300",
  slate: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

export function AdminModulePage({ config }: { config: AdminModuleConfig }) {
  const liveConfig = getLiveModuleConfig(config);
  const Icon = liveConfig.icon;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
        <div className={`absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${liveConfig.accent} opacity-20 blur-3xl`} />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-amber-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em]">{liveConfig.eyebrow}</p>
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight">{liveConfig.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">{liveConfig.description}</p>
          </div>
          <button className="flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 text-sm font-bold text-slate-950 transition-transform hover:-translate-y-0.5">
            Add record <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {liveConfig.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
            <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-950">Recent records</h2>
            <p className="mt-1 text-xs text-slate-500">Live demo data ready for database connection.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
            <Search className="h-4 w-4" /> Search records
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                {liveConfig.columns.map((column) => <th key={column} className="px-5 py-4">{column}</th>)}
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {liveConfig.rows.map((row) => (
                <tr key={row.cells.join("-")} className="transition-colors hover:bg-amber-50/30">
                  {row.cells.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="px-5 py-4 font-medium text-slate-700">{cell}</td>)}
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[row.status?.tone ?? "slate"]}`}>
                      {row.status?.label ?? "Tracked"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
