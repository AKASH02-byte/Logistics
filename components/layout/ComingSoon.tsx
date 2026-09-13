export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{title}</h1>
      <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
        This module is scheduled for {phase} of the build — see
        docs/DEVELOPMENT_PLAN.md.
      </p>
    </div>
  );
}
