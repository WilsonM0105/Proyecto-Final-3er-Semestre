import { Link } from "react-router-dom";
import Header from "../components/Header";

function NotFound() {
  return (
    <div>
      <Header />
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h2 style={{ marginBottom: ".5rem" }}>404 – Página no encontrada</h2>
        <p style={{ color: "#6b7280" }}>
          La ruta que intentaste visitar no existe.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <Link
            to="/"
            style={{
              background: "#111827",
              color: "#fff",
              padding: ".6rem 1rem",
              borderRadius: "10px",
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
