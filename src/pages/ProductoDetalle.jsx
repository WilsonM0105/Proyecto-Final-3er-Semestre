import { useParams, useNavigate, useLocation } from "react-router-dom";
import { productos } from "../data/productos";
import Header from "../components/Header";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // para leer ?cat=...
  const search = location.search; // ej: "?cat=Ropa"
  const producto = productos.find((p) => p.id === parseInt(id, 10));

  const handleVolver = () => {
    // Si hay historial, retrocede.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback: regresar a Home preservando el filtro si existe
      navigate(`/${search || ""}`, { replace: true });
    }
  };

  if (!producto) {
    return (
      <div>
        <Header />
        <main style={{ padding: "1rem" }}>
          <p>Producto no encontrado.</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={handleVolver}
              aria-label="Volver a la página anterior"
              style={{
                background: "#e5e7eb",
                color: "#111827",
                border: "none",
                borderRadius: "8px",
                padding: ".4rem .7rem",
                cursor: "pointer",
              }}
            >
              ← Volver
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Volver al inicio"
              style={{
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: ".4rem .7rem",
                cursor: "pointer",
              }}
            >
              Volver al inicio
            </button>
          </div>
        </main>
      </div>
    );
  }

  const esDisponible = producto.estado === "disponible";

  return (
    <div>
      <Header />
      <main style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
        {/* Botones Volver / Inicio */}
        <div style={{ marginBottom: "0.75rem", display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={handleVolver}
            aria-label="Volver a la página anterior"
            style={{
              background: "#e5e7eb",
              color: "#111827",
              border: "none",
              borderRadius: "8px",
              padding: ".4rem .7rem",
              cursor: "pointer",
            }}
          >
            ← Volver
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Volver al inicio"
            style={{
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: ".4rem .7rem",
              cursor: "pointer",
            }}
          >
            Volver al inicio
          </button>
        </div>

        <img
          src={producto.imagen}
          alt={`Imagen del producto ${producto.nombre}`}
          style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
        />
        <h2>{producto.nombre}</h2>
        <p><strong>Descripción:</strong> {producto.descripcion}</p>
        <p><strong>Precio:</strong> ${producto.precio}</p>
        <p><strong>Categoría:</strong> {producto.categoria}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span style={{ color: esDisponible ? "green" : "red" }}>
            {esDisponible ? "Disponible" : "No disponible"}
          </span>
        </p>

        <button
          disabled={!esDisponible}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: esDisponible ? "#28a745" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: esDisponible ? "pointer" : "not-allowed",
          }}
          onClick={() => alert("Simulación de compra (sin backend)")}
          aria-disabled={!esDisponible}
          aria-label={esDisponible ? "Comprar este producto" : "Producto no disponible para compra"}
        >
          {esDisponible ? "Comprar" : "No disponible"}
        </button>
      </main>
    </div>
  );
}

export default ProductoDetalle;
