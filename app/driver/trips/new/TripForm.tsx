"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitTrip } from "./actions";
import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

export function TripForm({
  vehicleSessionId,
  startOdometer,
}: {
  vehicleSessionId: string;
  startOdometer: number;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<{
    correctedEndOdometer: number;
    message: string;
  } | null>(null);

  const [endOdometer, setEndOdometer] = useState<string>("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const distance =
    endOdometer && Number(endOdometer) > startOdometer
      ? Number(endOdometer) - startOdometer
      : null;

  const handleSubmit = async (e: React.FormEvent, overrideEndOdo?: number) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuggestion(null);
    setWarnings([]);

    const endOdo = overrideEndOdo ?? Number(endOdometer);

    const result = await submitTrip(
      vehicleSessionId,
      startOdometer,
      endOdo,
      fromLocation,
      toLocation
    );

    if (!result.ok) {
      setError(result.error ?? "Failed to log trip.");
      if (result.suggestion) setSuggestion(result.suggestion);
      setSubmitting(false);
      return;
    }

    if (result.warnings?.length) setWarnings(result.warnings);
    // Short delay so the driver sees warnings before redirect
    setTimeout(() => router.push("/driver/dashboard"), result.warnings?.length ? 1800 : 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-slate-700 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/25 ring-1 ring-white/5 sm:p-5">

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion banner — smart auto-correct */}
      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
          >
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-100">{suggestion.message}</p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={(e) => {
                  setEndOdometer(String(suggestion.correctedEndOdometer));
                  setSuggestion(null);
                  setError(null);
                }}
                className="mt-2 text-xs font-bold text-amber-300 underline underline-offset-2"
              >
                Use {suggestion.correctedEndOdometer.toLocaleString("en-IN")} km instead
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning banner */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            <div>
              {warnings.map((w, i) => (
                <p key={i} className="text-sm text-emerald-100">{w}</p>
              ))}
              <p className="mt-1 text-xs text-emerald-300">Trip saved. Redirecting…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          From location
        </label>
        <input
          type="text"
          required
          value={fromLocation}
          onChange={(e) => setFromLocation(e.target.value)}
          placeholder="e.g. Jamkandi"
          className="mt-3 w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          To location
        </label>
        <input
          type="text"
          required
          value={toLocation}
          onChange={(e) => setToLocation(e.target.value)}
          placeholder="e.g. Bangalore"
          className="mt-3 w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Ending odometer
        </label>
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
          <span className="font-mono text-sm font-semibold text-amber-300">
            {startOdometer.toLocaleString("en-IN")}
          </span>
          km at session start
        </div>
        <input
          type="number"
          required
          min={startOdometer}
          value={endOdometer}
          onChange={(e) => {
            setEndOdometer(e.target.value);
            setError(null);
            setSuggestion(null);
          }}
          placeholder="Enter current dashboard reading"
          className="mt-3 w-full rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />

        <AnimatePresence>
          {distance !== null && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-3 text-xs font-semibold ${
                distance > 1500
                  ? "text-red-300"
                  : distance > 800
                  ? "text-amber-300"
                  : "text-emerald-300"
              }`}
            >
              Distance: {distance.toLocaleString("en-IN")} km
              {distance > 1500 && " ⚠ Exceeds maximum — verify odometer"}
              {distance > 800 && distance <= 1500 && " · Unusually high, double-check"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-3 pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting}
          className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-5 text-base font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-transform disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Logging…" : "Log Trip"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => router.push("/driver/dashboard")}
          className="flex min-h-[56px] w-full items-center justify-center rounded-2xl border border-slate-600 bg-slate-900/80 px-5 text-base font-bold text-white transition-transform hover:-translate-y-0.5 hover:border-slate-500"
        >
          Cancel
        </motion.button>
      </div>
    </form>
  );
}
