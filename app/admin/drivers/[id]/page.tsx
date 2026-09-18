import { notFound } from "next/navigation";
import { demoStore, findTruckById, type DemoLabour } from "@/lib/demo/store";
import { DriverProfileClient, type DriverProfile } from "./DriverProfileClient";

function createProfile(driver: DemoLabour, index: number): DriverProfile {
  const truck = demoStore.trucks[index % demoStore.trucks.length];
  const tripDistance = 28400 + index * 1720;

  return {
    driver,
    personal: {
      emergencyContact: index % 2 === 0 ? "Meena Kumar · 98450 11001" : "Lakshmi Reddy · 98450 11002",
      address: index % 2 === 0 ? "24, 3rd Cross, Yeshwanthpur, Bengaluru" : "17, Market Road, Banjara Hills, Hyderabad",
      joiningDate: `${String(12 + index).padStart(2, "0")} Mar 202${3 + (index % 3)}`,
    },
    license: {
      number: `KA-${String(20190000 + index * 14837)}`,
      expiryDate: index % 3 === 0 ? "24 Oct 2026" : "18 Jun 2027",
      verification: index % 4 === 0 ? "Renewal due" : "Verified",
      badgeType: index % 2 === 0 ? "Heavy Transport (HMV)" : "Heavy Goods (HGV)",
    },
    assignment: {
      truckId: truck.id,
      registrationNumber: truck.registrationNumber,
      truckName: `${truck.make} ${truck.model}`,
      dutyStatus: index % 4 === 0 ? "On Leave" : index % 3 === 0 ? "On Trip" : "Available",
    },
    metrics: {
      tripsCompleted: 142 + index * 11,
      distanceDriven: tripDistance,
      safetyScore: 91 - (index % 5),
      payouts: 486000 + index * 32750,
    },
    trips: [
      { id: "trip-1", origin: "Bengaluru", destination: "Hyderabad", vehicle: truck.registrationNumber, startedAt: "16 Sep 2026, 06:40", endedAt: "17 Sep 2026, 15:20", status: "Completed", distance: "568 km" },
      { id: "trip-2", origin: "Chennai", destination: "Bengaluru", vehicle: truck.registrationNumber, startedAt: "11 Sep 2026, 05:55", endedAt: "11 Sep 2026, 18:10", status: "Completed", distance: "348 km" },
      { id: "trip-3", origin: "Mysuru", destination: "Pune", vehicle: truck.registrationNumber, startedAt: "20 Sep 2026, 07:10", endedAt: "In progress", status: "Ongoing", distance: "812 km" },
      { id: "trip-4", origin: "Tumakuru", destination: "Coimbatore", vehicle: truck.registrationNumber, startedAt: "04 Sep 2026, 06:20", endedAt: "05 Sep 2026, 14:45", status: "Completed", distance: "432 km" },
    ],
    financials: [
      { id: "settlement-1", type: "Monthly allowance", description: "September route allowance", date: "15 Sep 2026", amount: 18500, status: "Paid" },
      { id: "settlement-2", type: "Driver advance", description: "Trip advance · Mysuru to Pune", date: "20 Sep 2026", amount: 12000, status: "Pending" },
      { id: "settlement-3", type: "Fuel card", description: "Card settlement · August", date: "31 Aug 2026", amount: 84200, status: "Reconciled" },
      { id: "settlement-4", type: "Pending payout", description: "Completed trips · Week 37", date: "18 Sep 2026", amount: 22400, status: "Pending" },
    ],
  };
}

export default async function DriverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = demoStore.labours.find((item) => item.id === id);
  if (!driver) notFound();

  const index = demoStore.labours.findIndex((item) => item.id === id);
  const profile = createProfile(driver, index);
  if (!findTruckById(profile.assignment.truckId)) notFound();

  return <DriverProfileClient profile={profile} />;
}
