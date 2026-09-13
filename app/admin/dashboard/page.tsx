import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getKpis() {
  const supabase = await createSupabaseServerClient();

  const [{ count: activeTrucks }, { count: openSessions }, { count: tripsToday }] =
    await Promise.all([
      supabase
        .from("trucks")
        .select("id", { count: "exact", head: true })
        .eq("status", "ACTIVE")
        .is("deleted_at", null),
      supabase
        .from("vehicle_sessions")
        .select("id", { count: "exact", head: true })
        .eq("status", "OPEN"),
      supabase
        .from("trips")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

  return {
    activeTrucks: activeTrucks ?? 0,
    openSessions: openSessions ?? 0,
    tripsToday: tripsToday ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const kpis = await getKpis();

  const tiles = [
    { label: "Active trucks", value: kpis.activeTrucks },
    { label: "Trucks on the road now", value: kpis.openSessions },
    { label: "Trips today", value: kpis.tripsToday },
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
