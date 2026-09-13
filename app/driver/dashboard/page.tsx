import { redirect } from "next/navigation";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { requireLabourSession } from "@/lib/rbac/labour";

export default async function DriverDashboardPage() {
  const labour = await requireLabourSession();
  const supabase = createSupabaseServiceRoleClient();

  const { data: session } = await supabase
    .from("vehicle_sessions")
    .select("*, trucks(registration_number, make, model)")
    .eq("labour_id", labour.id)
    .eq("status", "OPEN")
    .maybeSingle();

  if (!session) {
    redirect("/driver/select-truck");
  }

  const truck = session.trucks as unknown as {
    registration_number: string;
    make: string | null;
    model: string | null;
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 700 }}>Today&rsquo;s shift</h1>
      <div
        style={{
          marginTop: "1rem",
          padding: "1.25rem",
          borderRadius: 12,
          background: "#fff",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{truck.registration_number}</div>
        <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          {[truck.make, truck.model].filter(Boolean).join(" ")}
        </div>
        <div style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
          Opening odometer:{" "}
          <strong>{Number(session.opening_odometer).toLocaleString("en-IN")} km</strong>
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.75rem", marginTop: "1.25rem" }}>
        <a
          href="/driver/trips/new"
          style={{
            display: "block",
            textAlign: "center",
            padding: "1rem",
            minHeight: 52,
            borderRadius: 10,
            background: "#16181c",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Log a trip
        </a>
        <a
          href="/driver/fuel/new"
          style={{
            display: "block",
            textAlign: "center",
            padding: "1rem",
            minHeight: 52,
            borderRadius: 10,
            border: "1px solid #d1d5db",
            color: "#16181c",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Log fuel
        </a>
      </div>
    </div>
  );
}
