import { demoStore } from "@/lib/demo/store";
import { Fuel } from "lucide-react";
import dayjs from "dayjs";

export default async function AdminFuelPage() {
  const fuelLogs = [...demoStore.fuelLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sessions = demoStore.vehicleSessions;
  const trucks = demoStore.trucks;
  const drivers = demoStore.labours;

  const viewData = fuelLogs.map((fuel) => {
    const session = sessions.find((s) => s.id === fuel.vehicleSessionId);
    const truck = trucks.find((t) => t.id === session?.truckId);
    const driver = drivers.find((d) => d.id === session?.labourId);
    return { ...fuel, truck, driver };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Fuel className="w-7 h-7 text-amber-500" />
          Fuel Log
        </h1>
        <p className="text-sm text-gray-500 mt-1">Review all fuel transactions recorded by drivers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Driver & Truck</th>
                <th className="px-6 py-4 text-right">Odometer</th>
                <th className="px-6 py-4 text-right">Quantity</th>
                <th className="px-6 py-4 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {viewData.map((fuel) => (
                <tr key={fuel.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{dayjs(fuel.createdAt).format("MMM D, YYYY")}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{dayjs(fuel.createdAt).format("h:mm A")}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{fuel.driver?.fullName}</div>
                    <div className="text-xs text-gray-500">{fuel.truck?.registrationNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {new Intl.NumberFormat("en-IN").format(fuel.odometer)} km
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-gray-900">
                    {fuel.liters.toFixed(2)} L
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                    ₹{new Intl.NumberFormat("en-IN").format(fuel.cost)}
                  </td>
                </tr>
              ))}
              {viewData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No fuel logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
