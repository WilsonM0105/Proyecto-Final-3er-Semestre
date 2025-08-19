import { Link } from "react-router-dom";
import Header from "../components/Header";

function NotFound() {
  return (
    <div>
      <Header />
      <main className="container center">
        <section className="section">
          <h2 className="title-lg" style={{ marginBottom: ".25rem" }}>404 – Página no encontrada</h2>
          <p className="muted">La ruta que intentaste visitar no existe.</p>
          <div style={{ marginTop: "1rem" }}>
            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotFound;
