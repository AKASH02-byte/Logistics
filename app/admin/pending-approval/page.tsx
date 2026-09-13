export default function PendingApprovalPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 420 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Access pending</h1>
        <p style={{ marginTop: "0.75rem", color: "#4b5563" }}>
          Your account has been created but has not been granted access yet.
          Ask a Super Admin or Business Owner to activate your account from
          Settings → Users.
        </p>
      </div>
    </main>
  );
}
