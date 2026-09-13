import { demoStore } from "@/lib/demo/store";

function getKpis() {
  const activeTrucks = demoStore.trucks.filter((t) => t.status === "ACTIVE").length;
  const openSessions = demoStore.vehicleSessions.filter((s) => s.status === "OPEN").length;

  return { activeTrucks, openSessions, totalLabours: demoStore.labours.length };
}

export default function AdminDashboardPage() {
  const kpis = getKpis();

  const tiles = [
    { label: "Active trucks", value: kpis.activeTrucks },
    { label: "Trucks on the road now", value: kpis.openSessions },
    { label: "Registered labour", value: kpis.totalLabours },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Dashboard
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.label}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "1.25rem",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: 700 }}>{tile.value}</div>
            <div style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: "0.25rem" }}>
              {tile.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
