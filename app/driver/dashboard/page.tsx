import { redirect } from "next/navigation";
import { findTruckById, getOpenSessionForLabour } from "@/lib/demo/store";
import { requireLabourSession } from "@/lib/rbac/labour";

export default async function DriverDashboardPage() {
  const labour = await requireLabourSession();
  const session = getOpenSessionForLabour(labour.id);

  if (!session) {
    redirect("/driver/select-truck");
  }

  const truck = findTruckById(session.truckId);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30 ring-1 ring-white/5 backdrop-blur-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-400/80">
              Shift status
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
              Today&rsquo;s shift
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Active
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/60 p-4 shadow-inner shadow-slate-950/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Assigned vehicle
              </p>
              <div className="mt-2 text-2xl font-black text-white">
                {truck?.registrationNumber ?? "Vehicle"}
              </div>
            </div>
            <div className="rounded-xl bg-amber-500/10 px-3 py-2 text-right">
              <div className="text-[10px] uppercase tracking-[0.22em] text-amber-300">KM</div>
              <div className="text-lg font-bold text-amber-200">
                {session.openingOdometer.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
            <span>{truck?.make ?? "Vehicle"} {truck?.model ?? "model"}</span>
            <span className="rounded-full bg-slate-800 px-2 py-1 text-xs font-medium text-slate-200">
              Opening odometer
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Status</div>
              <div className="mt-2 font-semibold text-white">On Duty</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Last meter</div>
              <div className="mt-2 font-semibold text-white">
                {session.openingOdometer.toLocaleString("en-IN")} km
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <a
          href="/driver/trips/new"
          className="flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-5 text-base font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
        >
          Log a trip
        </a>

        <a
          href="/driver/fuel/new"
          className="flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 px-5 text-base font-bold text-white shadow-lg shadow-slate-950/20 transition-transform hover:-translate-y-0.5 hover:border-slate-500"
        >
          Log fuel
        </a>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300">Quick notes</h2>
          <span className="text-xs text-slate-400">Today</span>
        </div>

        <ul className="mt-3 space-y-3 text-sm text-slate-200">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400" />
            Keep odometer readings current for every trip and fuel entry.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />
            Download logs before closing the shift to avoid delays.
          </li>
        </ul>
      </div>
    </div>
  );
}
