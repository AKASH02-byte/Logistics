"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoVehicleSession, DemoTruck, DemoLabour } from "@/lib/demo/store";
import { forceCloseSession } from "./actions";
import { Clock, ShieldAlert, History } from "lucide-react";
import dayjs from "dayjs";

type SessionView = DemoVehicleSession & {
  truck: DemoTruck | undefined;
  driver: DemoLabour | undefined;
};

export function SessionsClient({
  sessions,
  trucks,
  drivers,
}: {
  sessions: DemoVehicleSession[];
  trucks: DemoTruck[];
  drivers: DemoLabour[];
}) {
  const [closingId, setClosingId] = useState<string | null>(null);
  const [closingOdo, setClosingOdo] = useState<number>(0);

  const viewData: SessionView[] = sessions
    .map((s) => ({
      ...s,
      truck: trucks.find((t) => t.id === s.truckId),
      driver: drivers.find((d) => d.id === s.labourId),
    }))
    .sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());

  const activeSessions = viewData.filter((s) => s.status === "OPEN");
  const historySessions = viewData.filter((s) => s.status === "CLOSED");

  const handleForceClose = async (e: React.FormEvent, labourId: string) => {
    e.preventDefault();
    await forceCloseSession(labourId, closingOdo);
    setClosingId(null);
    setClosingOdo(0);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Clock className="w-7 h-7 text-amber-500" />
          Active Vehicle Sessions
        </h1>
        <p className="text-sm text-gray-500 mt-1">Monitor currently dispatched trucks and drivers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-amber-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Started At</th>
                <th className="px-6 py-4">Start Odo</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {activeSessions.map((session, i) => (
                  <motion.tr 
                    key={session.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {closingId === session.id ? (
                      <td colSpan={5} className="px-6 py-4 bg-red-50/30">
                        <form onSubmit={(e) => handleForceClose(e, session.labourId)} className="flex gap-4 items-center justify-end">
                          <span className="text-sm font-medium text-red-800">Force Close Session:</span>
                          <input
                            required
                            type="number"
                            placeholder="Closing Odometer"
                            min={session.openingOdometer}
                            value={closingOdo || ""}
                            onChange={(e) => setClosingOdo(Number(e.target.value))}
                            className="border border-red-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                          />
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm transition-colors">
                            Confirm
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                            type="button"
                            onClick={() => setClosingId(null)}
                            className="text-gray-500 hover:text-gray-700 px-2 py-2 text-sm font-medium transition-colors"
                          >
                            Cancel
                          </motion.button>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{session.driver?.fullName}</div>
                          <div className="text-xs text-gray-400 font-mono">{session.driver?.labourCode}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{session.truck?.registrationNumber}</div>
                          <div className="text-xs text-gray-400">
                            {session.truck?.make} {session.truck?.model}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {dayjs(session.openedAt).format("MMM D, YYYY h:mm A")}
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-500">
                          {new Intl.NumberFormat("en-IN").format(session.openingOdometer)} km
                        </td>
                        <td className="px-6 py-4 text-right">
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setClosingId(session.id);
                              setClosingOdo(session.openingOdometer);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md shadow-sm"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Force Close
                          </motion.button>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
              {activeSessions.length === 0 && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No active vehicle sessions right now.
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-400" />
          Session History
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Driver</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {historySessions.slice(0, 50).map((session, i) => (
                    <motion.tr 
                      key={session.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-900">{session.driver?.fullName}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="font-medium text-gray-900">{session.truck?.registrationNumber}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-gray-900">{dayjs(session.openedAt).format("MMM D, h:mm A")}</div>
                        <div className="text-xs text-gray-400">to {dayjs(session.closedAt).format("MMM D, h:mm A")}</div>
                      </td>
                      <td className="px-6 py-3 font-mono">
                        {session.closingOdometer && (
                          <span className="text-gray-900 font-medium">
                            {new Intl.NumberFormat("en-IN").format(session.closingOdometer - session.openingOdometer)} km
                          </span>
                        )}
                        <div className="text-xs text-gray-400 mt-0.5">
                          ({session.openingOdometer} → {session.closingOdometer})
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {historySessions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No session history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
