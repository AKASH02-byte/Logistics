"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitFuel } from "./actions";

export function FuelForm({
  vehicleSessionId,
  startOdometer,
}: {
  vehicleSessionId: string;
  startOdometer: number;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [odometer, setOdometer] = useState<string>("");
  const [liters, setLiters] = useState<string>("");
  const [cost, setCost] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const currentOdo = Number(odometer);
    if (currentOdo < startOdometer) {
      setError(`Odometer must be greater than or equal to start (${startOdometer} km)`);
      setSubmitting(false);
      return;
    }

    try {
      await submitFuel(vehicleSessionId, currentOdo, Number(liters), Number(cost));
      router.push("/driver/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log fuel");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-slate-700 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/25 ring-1 ring-white/5 sm:p-5">
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Current odometer
        </label>
        <div className="mt-2 text-xs text-slate-400">Starting odometer: {startOdometer.toLocaleString("en-IN")} km</div>
        <input
          type="number"
          required
          min={startOdometer}
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
          placeholder="Enter current odometer"
          className="mt-3 w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Fuel quantity
        </label>
        <input
          type="number"
          required
          step="0.1"
          min="0.1"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
          placeholder="e.g. 50.5"
          className="mt-3 w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Total cost
        </label>
        <input
          type="number"
          required
          step="0.01"
          min="1"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="e.g. 4500"
          className="mt-3 w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-5 text-base font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Logging..." : "Log Fuel"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/driver/dashboard")}
          className="flex min-h-[56px] w-full items-center justify-center rounded-2xl border border-slate-600 bg-slate-900/80 px-5 text-base font-bold text-white transition-transform hover:-translate-y-0.5 hover:border-slate-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
