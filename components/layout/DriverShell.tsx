import type { ReactNode } from "react";
import type { LabourRow } from "@/types/database";

export function DriverShell({ labour, children }: { labour: LabourRow; children: ReactNode }) {
  return (
    <div style={{ minHeight: "100dvh", background: "#f4f5f7" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.25rem",
          background: "#16181c",
          color: "#f4f5f7",
        }}
      >
        <span style={{ fontWeight: 700 }}>Fleet Operations</span>
        <span style={{ fontSize: "0.9rem" }}>
          {labour.full_name} · {labour.labour_code}
        </span>
      </header>
      <main style={{ padding: "1.25rem", maxWidth: 640, margin: "0 auto" }}>{children}</main>
    </div>
  );
}
