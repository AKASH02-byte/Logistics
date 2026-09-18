"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DemoLabour } from "@/lib/demo/store";
import { addDriver, updateDriver, deleteDriver, resetLoginKey } from "./actions";
import { Plus, Edit2, Trash2, X, Check, Users, KeyRound, Copy } from "lucide-react";

export function DriversClient({ initialDrivers }: { initialDrivers: DemoLabour[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<DemoLabour, "id" | "loginKey" | "labourCode">>({
    fullName: "",
    phone: "",
    status: "ACTIVE",
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      status: "ACTIVE",
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDriver(formData);
    setIsAdding(false);
    resetForm();
  };

  const handleUpdate = async (id: string, e: React.FormEvent) => {
    e.preventDefault();
    await updateDriver(id, formData);
    setEditingId(null);
    resetForm();
  };

  const startEdit = (driver: DemoLabour) => {
    setEditingId(driver.id);
    setFormData({
      fullName: driver.fullName,
      phone: driver.phone,
      status: driver.status,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-amber-500" />
            Labour & Drivers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage personnel and access credentials</p>
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
          Add Driver
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID & Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Login Key</th>
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
                          placeholder="Full Name (e.g. Ravi Kumar)"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-48 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        />
                        <input
                          required
                          type="text"
                          placeholder="Phone (e.g. 9900011001)"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        />
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as DemoLabour["status"] })}
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                        </select>
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
                {initialDrivers.map((driver, i) => (
                  <motion.tr 
                    key={driver.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {editingId === driver.id ? (
                      <td colSpan={5} className="px-6 py-4 bg-amber-50/30">
                        <form onSubmit={(e) => handleUpdate(driver.id, e)} className="flex gap-4 items-center">
                          <div className="text-gray-500 text-xs mr-2 font-mono">{driver.labourCode}</div>
                          <input
                            required
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-48 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                          />
                          <input
                            required
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                          />
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as DemoLabour["status"] })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="SUSPENDED">SUSPENDED</option>
                          </select>
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
                          <Link href={`/admin/drivers/${driver.id}`} className="block rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <div className="text-xs text-gray-400 font-mono mb-0.5">{driver.labourCode}</div>
                            <div className="font-semibold text-gray-900 hover:text-amber-700">{driver.fullName}</div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">{driver.phone}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              driver.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {driver.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono text-xs">
                              {driver.loginKey}
                            </code>
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(driver.loginKey)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={async () => {
                                if (confirm(`Reset login key for ${driver.fullName}?`)) {
                                  await resetLoginKey(driver.id);
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              title="Reset Login Key"
                            >
                              <KeyRound className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => startEdit(driver)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={async () => {
                                if (confirm(`Delete ${driver.fullName}?`)) {
                                  await deleteDriver(driver.id);
                                }
                              }}
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
              {initialDrivers.length === 0 && !isAdding && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No drivers found. Add your first driver to get started.
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
