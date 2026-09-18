import { demoStore } from "@/lib/demo/store";
import { Map, MapPin } from "lucide-react";
import dayjs from "dayjs";

export default async function AdminTripsPage() {
  const trips = [...demoStore.trips].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const sessions = demoStore.vehicleSessions;
  const trucks = demoStore.trucks;
  const drivers = demoStore.labours;

  const viewData = trips.map((trip) => {
    const session = sessions.find((s) => s.id === trip.vehicleSessionId);
    const truck = trucks.find((t) => t.id === session?.truckId);
    const driver = drivers.find((d) => d.id === session?.labourId);
    return { ...trip, truck, driver };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Map className="w-7 h-7 text-amber-500" />
          Trip History
        </h1>
        <p className="text-sm text-gray-500 mt-1">Review all trips logged by drivers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Driver & Truck</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {viewData.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{dayjs(trip.createdAt).format("MMM D, YYYY")}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{dayjs(trip.createdAt).format("h:mm A")}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{trip.driver?.fullName}</div>
                    <div className="text-xs text-gray-500">{trip.truck?.registrationNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{trip.fromLocation}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-gray-900">{trip.toLocation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono font-medium text-gray-900">
                      {new Intl.NumberFormat("en-IN").format(trip.endOdometer - trip.startOdometer)} km
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      ({trip.startOdometer} → {trip.endOdometer})
                    </div>
                  </td>
                </tr>
              ))}
              {viewData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No trips logged yet.
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
