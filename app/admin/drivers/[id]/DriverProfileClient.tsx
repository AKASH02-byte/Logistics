"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { DemoLabour } from "@/lib/demo/store";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, CircleAlert, CreditCard,
  FileCheck2, Gauge, MapPin, Phone, ShieldCheck, Truck, UserRound, Wallet,
} from "lucide-react";

type ProfileTab = "overview" | "trips" | "financials";
type DutyStatus = "On Trip" | "Available" | "On Leave";

type DriverProfile = {
  driver: DemoLabour;
  personal: { emergencyContact: string; address: string; joiningDate: string };
  license: { number: string; expiryDate: string; verification: string; badgeType: string };
  assignment: { truckId: string; registrationNumber: string; truckName: string; dutyStatus: DutyStatus };
  metrics: { tripsCompleted: number; distanceDriven: number; safetyScore: number; payouts: number };
  trips: TripRecord[];
  financials: FinancialRecord[];
};

export type { DriverProfile };

type TripRecord = {
  id: string;
  origin: string;
  destination: string;
  vehicle: string;
  startedAt: string;
  endedAt: string;
  status: "Completed" | "Ongoing";
  distance: string;
};

type FinancialRecord = {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Reconciled";
};

const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "trips", label: "Trips & work history" },
  { id: "financials", label: "Financials & settlements" },
];

export function DriverProfileClient({ profile }: { profile: DriverProfile }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const { driver } = profile;
  const initials = driver.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2);

  return (
    <div className="min-h-full space-y-6 pb-8 text-slate-100">
      <Link href="/admin/drivers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-amber-400">
        <ArrowLeft className="h-4 w-4" /> Back to drivers
      </Link>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#17191e] shadow-2xl shadow-black/10">
        <div className="h-24 bg-[radial-gradient(circle_at_80%_20%,rgba(245,166,35,0.22),transparent_42%),linear-gradient(115deg,#272b32,#17191e)]" />
        <div className="-mt-10 flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#17191e] bg-amber-400 text-2xl font-black text-slate-950 shadow-xl">{initials}</div>
            <div className="pb-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Driver profile</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-white">{driver.fullName}</h1>
              <p className="mt-1 text-xs text-slate-500">{driver.labourCode} · {driver.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-end">
            <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${driver.status === "ACTIVE" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" : "border-red-400/25 bg-red-400/10 text-red-300"}`}>{driver.status === "ACTIVE" ? "Active driver" : "Suspended"}</span>
            <Link href="/admin/trucks" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-amber-400/40 hover:text-amber-300"><Truck className="h-3.5 w-3.5" /> View fleet</Link>
          </div>
        </div>
      </section>

      <div className="border-b border-white/10">
        <div className="flex gap-6 overflow-x-auto scrollbar-none">
          {PROFILE_TABS.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? "border-amber-400 text-amber-300" : "border-transparent text-slate-300 hover:text-white"}`}>{tab.label}</button>)}
        </div>
      </div>

      {activeTab === "overview" && <Overview profile={profile} />}
      {activeTab === "trips" && <TripsHistory trips={profile.trips} />}
      {activeTab === "financials" && <Financials records={profile.financials} payouts={profile.metrics.payouts} />}
    </div>
  );
}

function Overview({ profile }: { profile: DriverProfile }) {
  const { driver, personal, license, assignment, metrics } = profile;
  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={MapPin} label="Trips completed" value={metrics.tripsCompleted.toLocaleString("en-IN")} detail="Lifetime completed" />
      <Metric icon={Gauge} label="Distance driven" value={`${metrics.distanceDriven.toLocaleString("en-IN")} km`} detail="Across all routes" />
      <Metric icon={ShieldCheck} label="Safety score" value={`${metrics.safetyScore}/100`} detail="Excellent rating" accent />
      <Metric icon={Wallet} label="Total payouts" value={`₹${metrics.payouts.toLocaleString("en-IN")}`} detail="Paid and pending" />
    </div>
    <div className="grid gap-6 xl:grid-cols-2">
      <InfoSection title="Personal & contact" icon={UserRound}>
        <InfoItem label="Full name" value={driver.fullName} icon={UserRound} />
        <InfoItem label="Phone number" value={driver.phone} icon={Phone} />
        <InfoItem label="Emergency contact" value={personal.emergencyContact} icon={Phone} />
        <InfoItem label="Address" value={personal.address} icon={MapPin} />
        <InfoItem label="Joining date" value={personal.joiningDate} icon={CalendarDays} />
      </InfoSection>
      <InfoSection title="License & compliance" icon={FileCheck2}>
        <InfoItem label="Driving license" value={license.number} icon={BadgeCheck} />
        <InfoItem label="Expiry date" value={license.expiryDate} icon={CalendarDays} />
        <InfoItem label="Verification status" value={license.verification} icon={license.verification === "Verified" ? CheckCircle2 : CircleAlert} tone={license.verification === "Verified" ? "green" : "amber"} />
        <InfoItem label="Badge type" value={license.badgeType} icon={BadgeCheck} />
      </InfoSection>
    </div>
    <InfoSection title="Current assignment" icon={Truck}>
      <div className="grid gap-4 sm:grid-cols-3"><InfoItem label="Assigned truck" value={assignment.registrationNumber} icon={Truck} /><InfoItem label="Make & model" value={assignment.truckName} icon={Truck} /><InfoItem label="Duty status" value={assignment.dutyStatus} icon={assignment.dutyStatus === "On Trip" ? MapPin : CheckCircle2} tone={assignment.dutyStatus === "On Leave" ? "amber" : "green"} /></div>
    </InfoSection>
  </div>;
}

function TripsHistory({ trips }: { trips: TripRecord[] }) {
  return <Panel title="Trips & work history" subtitle="Completed and ongoing assignments for this driver"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Route</th><th className="px-5 py-4">Vehicle</th><th className="px-5 py-4">Start</th><th className="px-5 py-4">End</th><th className="px-5 py-4">Distance</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y divide-white/10">{trips.map((trip) => <tr key={trip.id} className="hover:bg-white/[0.03]"><td className="px-5 py-4"><div className="font-semibold text-slate-200">{trip.origin} → {trip.destination}</div><div className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3 w-3" /> Route assignment</div></td><td className="px-5 py-4 font-mono text-xs text-slate-400">{trip.vehicle}</td><td className="px-5 py-4 text-xs text-slate-400">{trip.startedAt}</td><td className="px-5 py-4 text-xs text-slate-400">{trip.endedAt}</td><td className="px-5 py-4 text-slate-300">{trip.distance}</td><td className="px-5 py-4"><StatusBadge status={trip.status} /></td></tr>)}</tbody></table></div></Panel>;
}

function Financials({ records, payouts }: { records: FinancialRecord[]; payouts: number }) {
  const pending = records.filter((record) => record.status === "Pending").reduce((sum, record) => sum + record.amount, 0);
  return <div className="space-y-6"><div className="grid gap-3 sm:grid-cols-3"><Metric icon={Wallet} label="Total payouts" value={`₹${payouts.toLocaleString("en-IN")}`} detail="Year to date" /><Metric icon={CreditCard} label="Pending payout" value={`₹${pending.toLocaleString("en-IN")}`} detail="Needs settlement" /><Metric icon={Gauge} label="Fuel cards handled" value="₹84,200" detail="Reconciled August" /></div><Panel title="Financials & settlements" subtitle="Advances, allowances, fuel cards and pending payouts"><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Type</th><th className="px-5 py-4">Description</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Status</th></tr></thead><tbody className="divide-y divide-white/10">{records.map((record) => <tr key={record.id} className="hover:bg-white/[0.03]"><td className="px-5 py-4 font-semibold text-slate-200">{record.type}</td><td className="px-5 py-4 text-slate-400">{record.description}</td><td className="px-5 py-4 text-xs text-slate-400">{record.date}</td><td className="px-5 py-4 font-semibold text-slate-200">₹{record.amount.toLocaleString("en-IN")}</td><td className="px-5 py-4"><StatusBadge status={record.status} /></td></tr>)}</tbody></table></div></Panel></div>;
}

function Metric({ icon: Icon, label, value, detail, accent = false }: { icon: LucideIcon; label: string; value: string; detail: string; accent?: boolean }) {
  return <div className="rounded-xl border border-white/10 bg-[#17191e] p-4"><div className="flex items-center gap-2 text-slate-500"><Icon className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-wider">{label}</span></div><p className={`mt-3 text-xl font-black ${accent ? "text-emerald-300" : "text-white"}`}>{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function InfoSection({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) {
  return <section className="rounded-xl border border-white/10 bg-[#17191e] p-5"><div className="mb-4 flex items-center gap-2"><Icon className="h-4 w-4 text-amber-400" /><h2 className="text-sm font-bold text-white">{title}</h2></div>{children}</section>;
}

function InfoItem({ label, value, icon: Icon, tone }: { label: string; value: string; icon: LucideIcon; tone?: "green" | "amber" }) {
  return <div className="flex items-start gap-3 border-b border-white/10 py-3 last:border-0"><Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone === "green" ? "text-emerald-400" : tone === "amber" ? "text-amber-400" : "text-slate-500"}`} /><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-200">{value}</p></div></div>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <section className="overflow-hidden rounded-xl border border-white/10 bg-[#17191e]"><div className="border-b border-white/10 px-5 py-4"><h2 className="text-sm font-bold text-white">{title}</h2><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>{children}</section>;
}

function StatusBadge({ status }: { status: string }) {
  const style = status === "Pending" || status === "Ongoing" ? "bg-amber-400/10 text-amber-300" : "bg-emerald-400/10 text-emerald-300";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${style}`}>{status}</span>;
}
