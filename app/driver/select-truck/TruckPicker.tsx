"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";

interface AvailableTruck {
  id: string;
  registration_number: string;
  make: string | null;
  model: string | null;
  current_odometer: string;
}

export function TruckPicker({ trucks }: { trucks: AvailableTruck[] }) {
  const router = useRouter();
  const [selecting, setSelecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function selectTruck(truckId: string) {
    setSelecting(truckId);
    setError(null);

    const response = await fetch("/api/driver/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ truckId }),
    });
    const body = await response.json();

    if (!response.ok) {
      setError(body?.error?.message ?? "Could not select this truck. Try another.");
      setSelecting(null);
      return;
    }

    router.push("/driver/dashboard");
  }

  if (trucks.length === 0) {
    return <p style={{ color: "#6b7280" }}>No trucks are available right now. Contact your admin.</p>;
  }

  return (
    <div>
      {error && (
        <p
          style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "0.6rem 0.85rem",
              borderRadius: 8,
              marginBottom: "1rem",
          }}
        >
          {error}
        </p>
      )}
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {trucks.map((truck) => (
          <button
            key={truck.id}
            onClick={() => selectTruck(truck.id)}
            disabled={selecting !== null}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              minHeight: 64,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "#fff",
              textAlign: "left",
              color: "#0f172a",
              cursor: selecting ? "wait" : "pointer",
              opacity: selecting && selecting !== truck.id ? 0.5 : 1,
              transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
            }}
            onMouseEnter={(event) => {
              if (!selecting) {
                event.currentTarget.style.borderColor = "#f59e0b";
                event.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.12)";
                event.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor = "#d1d5db";
              event.currentTarget.style.boxShadow = "none";
              event.currentTarget.style.transform = "none";
            }}
          >
            <Truck size={22} color="#d97706" strokeWidth={2.4} />
            <div>
              <div style={{ fontWeight: 800, color: "#111827", letterSpacing: "0.03em" }}>
                {truck.registration_number}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                {[truck.make, truck.model].filter(Boolean).join(" ") || "Truck"} ·{" "}
                {Number(truck.current_odometer).toLocaleString("en-IN")} km
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
