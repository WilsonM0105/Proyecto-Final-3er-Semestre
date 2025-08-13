function Loader({ text = "Cargando…" }) {
  return (
    <div style={{ display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        <span
          aria-hidden="true"
          style={{
            width: "1.25rem",
            height: "1.25rem",
            borderRadius: "999px",
            border: "3px solid #e5e7eb",
            borderTopColor: "#111827",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ color: "#6b7280" }}>{text}</span>
      </div>

      {/* keyframes inline */}
      <style>
        {`@keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }`}
      </style>
    </div>
  );
}

export default Loader;
