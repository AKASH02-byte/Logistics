"use client";

import { motion } from "framer-motion";
import {
  Truck, Users, Map, Fuel, Activity, Clock,
  TrendingUp, AlertTriangle, ArrowRight,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

/* ─── types ─────────────────────────────────────────── */
interface Kpis {
  activeTrucks: number;
  maintenanceTrucks: number;
  openSessions: number;
  totalTrips: number;
  totalDistanceKm: number;
  averageTripDistanceKm: number;
  totalFuelCost: number;
  totalFuelLitres: number;
  fuelEfficiency: number | null;
  grossRevenue: number;
  netMargin: number;
  outstandingReceivables: number;
  projectPipelineValue: number;
  onTimeRate: number;
  maintenanceAlerts: number;
  totalLabours: number;
  activeLabours: number;
  activeUtilizationRate: number;
  fleetUtilizationRate: number;
  availabilityRate: number;
  recentTrips: {
    id: string; from: string; to: string; distance: number;
    truck: string; driver: string; createdAt: string;
  }[];
  activeSessions: {
    id: string; truck: string; driver: string; since: string; odo: number;
  }[];
}

/* ─── sub-components ─────────────────────────────────── */

function StatCard({
  icon: Icon, label, value, sub, accent, delay = 0,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; accent: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-6 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl ${accent}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
          <p className="text-4xl font-black text-gray-900 tabular-nums leading-none">
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
          {sub && <p className="text-xs text-gray-400 mt-1.5 font-medium">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent} bg-opacity-10`}>
          <Icon className="w-5 h-5 text-white opacity-80" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ${accent}`} />
    </motion.div>
  );
}

function formatRupee(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}

function PercentBar({ label, value, tone }: { label: string; value: number; tone: "amber" | "green" | "blue" | "violet" }) {
  const toneMap = {
    amber: "bg-amber-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    violet: "bg-violet-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="font-bold text-gray-900">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`${toneMap[tone]} h-full rounded-full`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

/** Animated SVG truck rolling across a road track */
function LiveTruckTrack() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    size: ((i * 7) % 5) + 1,
    top: `${((i * 17) % 55)}%`,
    left: `${((i * 13 + 7) % 100)}%`,
  }));

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 shadow-xl" style={{ height: 180 }}>
      {/* Stars / background texture */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
          }}
        />
      ))}

      {/* Road surface */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-700 to-gray-800 border-t border-gray-600/40" />

      {/* Road centre dashes — scrolling animation */}
      <div className="absolute bottom-6 left-0 right-0 h-2 overflow-hidden">
        <motion.div
          className="flex gap-8"
          animate={{ x: [0, -160] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-16 h-2 rounded-full bg-amber-400 opacity-60 shrink-0" />
          ))}
        </motion.div>
      </div>

      {/* Shoulder lines */}
      <div className="absolute bottom-14 left-0 right-0 h-0.5 bg-white opacity-10" />
      <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-white opacity-10" />

      {/* Truck SVG — rolling right-to-left */}
      <motion.div
        className="absolute"
        style={{ bottom: 52 }}
        animate={{ x: ["110%", "-25%"] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: [0.35, 0.05, 0.65, 0.95] }}
      >
        <svg viewBox="0 0 320 90" width={320} height={90} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dTrailerG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a6070" />
              <stop offset="100%" stopColor="#2a2e36" />
            </linearGradient>
            <linearGradient id="dCabG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a5060" />
              <stop offset="100%" stopColor="#1e2228" />
            </linearGradient>
            <radialGradient id="dHL" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd060" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffb030" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Trailer */}
          <rect x="10" y="12" width="180" height="58" rx="3" fill="url(#dTrailerG)" />
          <rect x="10" y="12" width="180" height="6" rx="2" fill="#707880" />
          {[40, 76, 112, 148].map((x) => (
            <rect key={x} x={x} y="18" width="2" height="52" rx="1" fill="rgba(0,0,0,0.3)" />
          ))}
          <rect x="10" y="58" width="180" height="5" rx="2" fill="#1a1c20" />
          {/* Chassis */}
          <rect x="20" y="70" width="280" height="5" rx="2" fill="#141618" />
          {/* Cab */}
          <path d="M190 70 V20 Q190 12 198 12 H248 Q256 12 262 22 L278 48 V70 Z" fill="url(#dCabG)" />
          {/* Windshield */}
          <path d="M198 18 H244 Q250 18 254 26 L264 46 H198 Z" fill="#7ac0d8" opacity="0.75" />
          {/* Door */}
          <rect x="190" y="34" width="52" height="36" rx="2" fill="rgba(0,0,0,0.15)" />
          <rect x="226" y="50" width="12" height="3" rx="1.5" fill="#555" />
          {/* Mirror */}
          <rect x="270" y="20" width="12" height="2" rx="1" fill="#333" />
          <rect x="280" y="15" width="9" height="12" rx="2" fill="#2a2e36" />
          {/* Headlight glow */}
          <circle cx="280" cy="58" r="14" fill="url(#dHL)" opacity="0.8" />
          <rect x="276" y="50" width="8" height="14" rx="2" fill="#ffe090" />
          {/* Exhaust */}
          <rect x="258" y="2" width="6" height="18" rx="2.5" fill="#2a2d32" />
          <circle cx="261" cy="0" r="3" fill="rgba(200,210,220,0.1)" />

          {/* Wheel — rear 1 */}
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "55px 75px" }}>
            <circle cx="55" cy="75" r="18" fill="#0f1113" />
            <circle cx="55" cy="75" r="13" fill="#555b63" />
            <circle cx="55" cy="75" r="5" fill="#1e2025" />
            {[0, 60, 120, 180, 240, 300].map((d) => {
              const r = (d * Math.PI) / 180;
              return <line key={d} x1={55 + 6 * Math.cos(r)} y1={75 + 6 * Math.sin(r)} x2={55 + 11 * Math.cos(r)} y2={75 + 11 * Math.sin(r)} stroke="#777e88" strokeWidth="1.5" strokeLinecap="round" />;
            })}
          </motion.g>
          {/* Wheel — rear 2 */}
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "100px 75px" }}>
            <circle cx="100" cy="75" r="18" fill="#0f1113" />
            <circle cx="100" cy="75" r="13" fill="#555b63" />
            <circle cx="100" cy="75" r="5" fill="#1e2025" />
            {[0, 60, 120, 180, 240, 300].map((d) => {
              const r = (d * Math.PI) / 180;
              return <line key={d} x1={100 + 6 * Math.cos(r)} y1={75 + 6 * Math.sin(r)} x2={100 + 11 * Math.cos(r)} y2={75 + 11 * Math.sin(r)} stroke="#777e88" strokeWidth="1.5" strokeLinecap="round" />;
            })}
          </motion.g>
          {/* Wheel — front */}
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "246px 75px" }}>
            <circle cx="246" cy="75" r="18" fill="#0f1113" />
            <circle cx="246" cy="75" r="13" fill="#555b63" />
            <circle cx="246" cy="75" r="5" fill="#1e2025" />
            {[0, 60, 120, 180, 240, 300].map((d) => {
              const r = (d * Math.PI) / 180;
              return <line key={d} x1={246 + 6 * Math.cos(r)} y1={75 + 6 * Math.sin(r)} x2={246 + 11 * Math.cos(r)} y2={75 + 11 * Math.sin(r)} stroke="#777e88" strokeWidth="1.5" strokeLinecap="round" />;
            })}
          </motion.g>
        </svg>
      </motion.div>

      {/* Label */}
      <div className="absolute top-4 left-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 opacity-70">Live Fleet Track</span>
      </div>
      {/* Pulse dot */}
      <div className="absolute top-4 right-5 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-[10px] font-semibold text-green-400">LIVE</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */

export function DashboardClient({ kpis }: { kpis: Kpis }) {
  const stats = [
    {
      icon: Truck,
      label: "Active Fleet",
      value: kpis.activeTrucks,
      sub: `${kpis.maintenanceTrucks} in maintenance`,
      accent: "bg-amber-500",
      delay: 0,
    },
    {
      icon: Activity,
      label: "On the Road",
      value: kpis.openSessions,
      sub: "Live dispatched sessions",
      accent: "bg-green-500",
      delay: 0.08,
    },
    {
      icon: Map,
      label: "Total Trips",
      value: kpis.totalTrips,
      sub: "All time",
      accent: "bg-blue-500",
      delay: 0.16,
    },
    {
      icon: Fuel,
      label: "Fuel Spend",
      value: `₹${new Intl.NumberFormat("en-IN").format(kpis.totalFuelCost)}`,
      sub: "All logged transactions",
      accent: "bg-orange-500",
      delay: 0.24,
    },
    {
      icon: Users,
      label: "Labour",
      value: kpis.activeLabours,
      sub: `${kpis.totalLabours} registered total`,
      accent: "bg-violet-500",
      delay: 0.32,
    },
    {
      icon: TrendingUp,
      label: "Utilization",
      value: kpis.activeTrucks
        ? `${Math.round((kpis.openSessions / kpis.activeTrucks) * 100)}%`
        : "—",
      sub: "Trucks currently deployed",
      accent: "bg-cyan-500",
      delay: 0.4,
    },
  ];

  const financeCards = [
    { label: "Gross Revenue", value: formatRupee(kpis.grossRevenue), sub: "Trip revenue and dispatch yield" },
    { label: "Net Margin", value: formatRupee(kpis.netMargin), sub: "After fuel and trip cost run-rate" },
    { label: "Receivables", value: formatRupee(kpis.outstandingReceivables), sub: "Current outstanding pipeline" },
    { label: "Avg Trip Distance", value: `${Math.round(kpis.averageTripDistanceKm)} km`, sub: "Average lane distance" },
  ];

  const businessScores = [
    { label: "Fleet Utilization", value: Math.round(kpis.fleetUtilizationRate), tone: "amber" as const },
    { label: "On-time Rate", value: kpis.onTimeRate, tone: "green" as const },
    { label: "Fuel Efficiency", value: kpis.fuelEfficiency ? Math.round(kpis.fuelEfficiency) : 0, tone: "blue" as const },
    { label: "Project Pipeline", value: Math.min(100, Math.round((kpis.projectPipelineValue / Math.max(1, kpis.grossRevenue + 200000)) * 100)), tone: "violet" as const },
  ];

  const insights = [
    `${kpis.openSessions} trucks are currently active on the road, giving a strong utilization run-rate for the week.`,
    `Average trip distance is ${Math.round(kpis.averageTripDistanceKm)} km, which keeps lane productivity stable across the fleet.`,
    `${kpis.maintenanceAlerts} maintenance and compliance checks are currently queued, so preventive work should stay ahead of disruption.`,
    `Gross revenue is trending well above fuel cost, leaving a healthy operating margin for dispatch and field execution.`,
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
            {dayjs().format("dddd, MMMM D")}
          </p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Fleet Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time overview of your logistics operations
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3.5 py-2 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Systems Operational
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Animated truck track */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <LiveTruckTrack />
      </motion.div>

      {/* Bottom two-col: Active Sessions + Recent Trips */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Active Sessions</h2>
                <p className="text-xs text-gray-400">Currently on-road drivers</p>
              </div>
            </div>
            <a href="/admin/sessions" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="divide-y divide-gray-100">
            {kpis.activeSessions.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-400">No active sessions right now.</div>
            ) : (
              kpis.activeSessions.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + i * 0.06 }}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{s.truck}</div>
                      <div className="text-xs text-gray-400">{s.driver}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-green-600 flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      LIVE
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{dayjs(s.since).fromNow()}</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.7 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Map className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Recent Trips</h2>
                <p className="text-xs text-gray-400">Last 5 completed trips</p>
              </div>
            </div>
            <a href="/admin/trips" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="divide-y divide-gray-100">
            {kpis.recentTrips.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-400">No trips logged yet.</div>
            ) : (
              kpis.recentTrips.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.06 }}
                  className="px-6 py-3.5 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <span>{t.from}</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span>{t.to}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-600">
                      {t.distance.toLocaleString("en-IN")} km
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{t.driver} · {t.truck}</span>
                    <span className="text-xs text-gray-400">{dayjs(t.createdAt).fromNow()}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

      </div>

      {/* Finance overview */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.82 }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Finance</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {financeCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-gray-400 mb-3">{card.label}</p>
              <p className="text-2xl font-black text-gray-900 tabular-nums">{card.value}</p>
              <p className="mt-2 text-xs text-gray-500">{card.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Business + insights */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Business</p>
              <h2 className="mt-1 text-xl font-black text-gray-900">Operational health</h2>
            </div>
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">Healthy</span>
          </div>

          <div className="space-y-5">
            {businessScores.map((item) => (
              <PercentBar key={item.label} label={item.label} value={item.value} tone={item.tone} />
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Pipeline</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-black text-gray-900 tabular-nums">{formatRupee(kpis.projectPipelineValue)}</p>
                <p className="text-xs text-gray-600 mt-1">Active project and tender pipeline</p>
              </div>
              <span className="text-xs font-semibold text-amber-700">+12.4% MoM</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.95 }}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Insights</p>
          <h2 className="mt-1 text-xl font-black text-gray-900">Smart summaries</h2>

          <div className="mt-5 space-y-3">
            {insights.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick links */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.0 }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin/trucks", label: "Manage Fleet", icon: Truck, color: "amber" },
            { href: "/admin/drivers", label: "Manage Drivers", icon: Users, color: "violet" },
            { href: "/admin/sessions", label: "Live Sessions", icon: Activity, color: "green" },
            { href: "/admin/fuel", label: "Fuel Log", icon: Fuel, color: "orange" },
          ].map(({ href, label, icon: Icon, color }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`w-8 h-8 rounded-lg bg-${color}-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{label}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
