"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DemoTruck } from "@/lib/demo/store";
import { addTruck, updateTruck, deleteTruck } from "./actions";
import {
  Plus, Edit2, Trash2, X, Check, Truck, Fuel, Gauge, Wrench,
  TrendingUp, MapPin, CalendarDays, FileCheck2, CircleDot,
} from "lucide-react";

type DetailTab = "trips" | "maintenance" | "fuel" | "documents";

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: "trips", label: "Trips history" },
  { id: "maintenance", label: "Maintenance & tyres" },
  { id: "fuel", label: "Fuel logs" },
  { id: "documents", label: "Documents" },
];

function detailNumber(truck: DemoTruck, offset: number) {
  return Math.max(0, truck.currentOdometer - offset);
}

export function TrucksClient({ initialTrucks }: { initialTrucks: DemoTruck[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<DemoTruck | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("trips");

  // Form state
  const [formData, setFormData] = useState<Omit<DemoTruck, "id">>({
    registrationNumber: "",
    make: "",
    model: "",
    status: "ACTIVE",
    currentOdometer: 0,
  });

  const resetForm = () => {
    setFormData({
      registrationNumber: "",
      make: "",
      model: "",
      status: "ACTIVE",
      currentOdometer: 0,
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTruck({ ...formData, currentOdometer: Number(formData.currentOdometer) });
    setIsAdding(false);
    resetForm();
  };

  const handleUpdate = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    await updateTruck(id, { ...formData, currentOdometer: Number(formData.currentOdometer) });
    setEditingId(null);
    resetForm();
  };

  const startEdit = (truck: DemoTruck) => {
    setSelectedTruck(null);
    setEditingId(truck.id);
    setFormData({
      registrationNumber: truck.registrationNumber,
      make: truck.make,
      model: truck.model,
      status: truck.status,
      currentOdometer: truck.currentOdometer,
    });
  };

  const openDetails = (truck: DemoTruck) => {
    setActiveTab("trips");
    setSelectedTruck(truck);
  };

  useEffect(() => {
    if (!selectedTruck) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedTruck(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedTruck]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Truck className="w-7 h-7 text-amber-500" />
            Fleet Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage all vehicles in your fleet</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            resetForm();
          }}
          className="bg-gray-900 hover:bg-gray-800 transition-colors text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Truck
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Reg. Number</th>
                <th className="px-6 py-4">Make & Model</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Odometer</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {isAdding && (
                  <motion.tr 
                    initial={{ opacity: 0, backgroundColor: "#fffbeb" }}
                    animate={{ opacity: 1, backgroundColor: "#fffbeb" }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="px-6 py-4">
                      <form onSubmit={handleAdd} className="flex gap-4 items-center">
                        <input
                          required
                          type="text"
                          placeholder="Registration (e.g. KA01AB1234)"
                          value={formData.registrationNumber}
                          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        />
                        <input
                          required
                          type="text"
                          placeholder="Make (e.g. Tata)"
                          value={formData.make}
                          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        />
                        <input
                          required
                          type="text"
                          placeholder="Model"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        />
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as DemoTruck["status"] })}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="IN_MAINTENANCE">IN_MAINTENANCE</option>
                          <option value="RETIRED">RETIRED</option>
                        </select>
                        <input
                          required
                          type="number"
                          placeholder="Odometer"
                          value={formData.currentOdometer}
                          onChange={(e) => setFormData({ ...formData, currentOdometer: Number(e.target.value) })}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        />
                        <div className="flex items-center gap-2 ml-auto">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="submit" className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                            <Check className="w-5 h-5" />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setIsAdding(false)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </form>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {initialTrucks.map((truck, i) => (
                  <motion.tr 
                    key={truck.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => openDetails(truck)}
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    {editingId === truck.id ? (
                      <td colSpan={5} className="px-6 py-4 bg-amber-50/30">
                        <form onSubmit={(e) => handleUpdate(truck.id, e)} className="flex gap-4 items-center">
                          <input
                            required
                            type="text"
                            value={formData.registrationNumber}
                            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          <input
                            required
                            type="text"
                            value={formData.make}
                            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          <input
                            required
                            type="text"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as DemoTruck["status"] })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="IN_MAINTENANCE">IN_MAINTENANCE</option>
                            <option value="RETIRED">RETIRED</option>
                          </select>
                          <input
                            required
                            type="number"
                            value={formData.currentOdometer}
                            onChange={(e) => setFormData({ ...formData, currentOdometer: Number(e.target.value) })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          <div className="flex items-center gap-2 ml-auto">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="submit" className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                              <Check className="w-5 h-5" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setEditingId(null)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                              <X className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <button type="button" onClick={(event) => { event.stopPropagation(); openDetails(truck); }} className="text-left">
                            <div className="font-semibold text-gray-900 hover:text-amber-700">{truck.registrationNumber}</div>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          {truck.make} {truck.model}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              truck.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : truck.status === "IN_MAINTENANCE"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {truck.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-500">
                          {new Intl.NumberFormat("en-IN").format(truck.currentOdometer)} km
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={(event) => { event.stopPropagation(); startEdit(truck); }}
                              aria-label={`Edit ${truck.registrationNumber}`}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={(event) => { event.stopPropagation(); deleteTruck(truck.id); }}
                              aria-label={`Delete ${truck.registrationNumber}`}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
              {initialTrucks.length === 0 && !isAdding && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No trucks found. Add your first truck to get started.
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedTruck && (
          <>
            <motion.button
              type="button"
              aria-label="Close truck details"
              className="fixed inset-0 z-40 cursor-default bg-gray-950/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTruck(null)}
            />
            <TruckDetailsPanel
              truck={selectedTruck}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onClose={() => setSelectedTruck(null)}
              onEdit={() => startEdit(selectedTruck)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function TruckDetailsPanel({ truck, activeTab, onTabChange, onClose, onEdit }: {
  truck: DemoTruck;
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  onClose: () => void;
  onEdit: () => void;
}) {
  const statusLabel = truck.status === "IN_MAINTENANCE" ? "In maintenance" : truck.status === "RETIRED" ? "Inactive" : "Active";
  const statusClass = truck.status === "ACTIVE" ? "bg-emerald-400/15 text-emerald-300 border-emerald-400/25" : truck.status === "IN_MAINTENANCE" ? "bg-amber-400/15 text-amber-300 border-amber-400/25" : "bg-slate-400/15 text-slate-300 border-slate-400/25";
  const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <motion.aside role="dialog" aria-modal="true" aria-labelledby="truck-details-title" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col overflow-hidden border-l border-white/10 bg-[#17191e] text-white shadow-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}>
      <div className="border-b border-white/10 bg-[#202329] px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Vehicle profile</p>
            <h2 id="truck-details-title" className="mt-2 text-2xl font-black tracking-tight">{truck.registrationNumber}</h2>
            <p className="mt-1 text-sm text-slate-400">{truck.make} {truck.model}</p>
            <span className={`mt-4 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-400/40 hover:text-amber-300"><Edit2 className="h-3.5 w-3.5" /> Edit</button>
            <button type="button" onClick={onClose} aria-label="Close details" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric icon={Gauge} label="Odometer" value={`${truck.currentOdometer.toLocaleString("en-IN")} km`} />
          <Metric icon={Fuel} label="Fuel cost" value={formatCurrency(318450)} />
          <Metric icon={Wrench} label="Maintenance" value={formatCurrency(126800)} />
          <Metric icon={TrendingUp} label="Net profit" value={formatCurrency(482600)} accent />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-[#202329] p-4 sm:grid-cols-3">
          <Metric icon={Gauge} label="Fuel efficiency" value="3.8 km/L" compact />
          <Metric icon={MapPin} label="Trips completed" value="86 trips" compact />
          <Metric icon={CalendarDays} label="Last service" value="12 Aug 2026" compact />
        </div>
        <div className="mt-7 border-b border-white/10"><div className="flex gap-5 overflow-x-auto scrollbar-none">{DETAIL_TABS.map((tab) => <button key={tab.id} type="button" onClick={() => onTabChange(tab.id)} className={`whitespace-nowrap border-b-2 pb-3 text-xs font-semibold transition-colors ${activeTab === tab.id ? "border-amber-400 text-amber-300" : "border-transparent text-slate-500 hover:text-slate-200"}`}>{tab.label}</button>)}</div></div>
        <div className="py-5">
          {activeTab === "trips" && <TripsDetail truck={truck} />}
          {activeTab === "maintenance" && <MaintenanceDetail />}
          {activeTab === "fuel" && <FuelDetail />}
          {activeTab === "documents" && <DocumentsDetail />}
        </div>
      </div>
    </motion.aside>
  );
}

function Metric({ icon: Icon, label, value, accent = false, compact = false }: { icon: typeof Gauge; label: string; value: string; accent?: boolean; compact?: boolean }) {
  return <div className={compact ? "min-w-0" : "rounded-xl border border-white/10 bg-[#202329] p-3.5"}><div className="flex items-center gap-2 text-slate-500"><Icon className="h-3.5 w-3.5" /><span className="truncate text-[10px] font-bold uppercase tracking-wider">{label}</span></div><p className={`${compact ? "mt-1" : "mt-2"} truncate text-sm font-bold ${accent ? "text-emerald-300" : "text-white"}`}>{value}</p></div>;
}

function DetailRow({ icon: Icon, title, meta, value }: { icon: typeof MapPin; title: string; meta: string; value: string }) {
  return <div className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-amber-400"><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-200">{title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{meta}</p></div><span className="shrink-0 text-sm font-semibold text-slate-300">{value}</span></div>;
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="mb-2"><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>;
}

function TripsDetail({ truck }: { truck: DemoTruck }) {
  return <div><SectionHeading title="Recent trips" subtitle="Latest completed journeys assigned to this vehicle" /><DetailRow icon={MapPin} title="Bengaluru → Hyderabad" meta={`Ravi Kumar · 16 Sep 2026 · ${detailNumber(truck, 420)} km`} value="Completed" /><DetailRow icon={MapPin} title="Chennai → Bengaluru" meta="Suresh Reddy · 11 Sep 2026 · 348 km" value="Completed" /><DetailRow icon={MapPin} title="Mysuru → Pune" meta="Manoj Singh · 04 Sep 2026 · 812 km" value="Completed" /></div>;
}

function MaintenanceDetail() {
  return <div><SectionHeading title="Maintenance & tyres" subtitle="Service history and replaced components" /><DetailRow icon={Wrench} title="Preventive service" meta="12 Aug 2026 · Engine oil, filters, inspection" value="₹18,450" /><DetailRow icon={CircleDot} title="Rear axle tyres" meta="28 Jun 2026 · 4 tyres replaced" value="₹64,000" /><DetailRow icon={Wrench} title="Brake system check" meta="10 Apr 2026 · Pads and air line" value="₹9,800" /></div>;
}

function FuelDetail() {
  return <div><SectionHeading title="Recent fuel fills" subtitle="Fuel station activity for the selected vehicle" /><DetailRow icon={Fuel} title="IndianOil · Hosur Road" meta="16 Sep 2026 · 312 L" value="₹31,824" /><DetailRow icon={Fuel} title="Bharat Petroleum · Tumakuru" meta="11 Sep 2026 · 286 L" value="₹29,172" /><DetailRow icon={Fuel} title="HPCL · Electronic City" meta="04 Sep 2026 · 301 L" value="₹30,702" /></div>;
}

function DocumentsDetail() {
  return <div><SectionHeading title="Documents & compliance" subtitle="Expiry tracking for statutory vehicle documents" /><DocumentRow title="Insurance policy" expiry="18 Nov 2026" tone="green" /><DocumentRow title="Fitness certificate" expiry="02 Feb 2027" tone="green" /><DocumentRow title="National permit" expiry="24 Oct 2026" tone="amber" /><DocumentRow title="Pollution (PUC)" expiry="30 Sep 2026" tone="red" /></div>;
}

function DocumentRow({ title, expiry, tone }: { title: string; expiry: string; tone: "green" | "amber" | "red" }) {
  const styles = { green: "text-emerald-300 bg-emerald-400/10", amber: "text-amber-300 bg-amber-400/10", red: "text-red-300 bg-red-400/10" };
  const labels = { green: "Valid", amber: "Renew soon", red: "Expiring" };
  return <div className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0"><FileCheck2 className="h-4 w-4 shrink-0 text-slate-500" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-200">{title}</p><p className="mt-0.5 text-xs text-slate-500">Expires {expiry}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${styles[tone]}`}>{labels[tone]}</span></div>;
}
