import { useParams } from "react-router-dom";
import { productos } from "../data/productos";
import Header from "../components/Header";

function ProductoDetalle() {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === parseInt(id));

  if (!producto) {
    return (
      <div>
        <Header />
        <main style={{ padding: "1rem" }}>
          <p>Producto no encontrado.</p>
        </main>
      </div>
    );
  }

  const esDisponible = producto.estado === "disponible";

  return (
    <div>
      <Header />
      <main style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
        />
        <h2>{producto.nombre}</h2>
        <p>
          <strong>Descripción:</strong> {producto.descripcion}
        </p>
        <p>
          <strong>Precio:</strong> ${producto.precio}
        </p>
        <p>
          <strong>Categoría:</strong> {producto.categoria}
        </p>
        <p>
          <strong>Estado:</strong>
          <span style={{ color: esDisponible ? "green" : "red" }}>
            {producto.estado === "disponible" ? "Disponible" : "No disponible"}
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
            cursor: esDisponible ? "pointer" : "not-allowed",
          }}
          onClick={() => {
            alert("Simulación de compra (sin backend)");
          }}
        >
          {esDisponible ? "Comprar" : "No disponible"}
        </button>
      </main>
    </div>
  );
}

export default ProductoDetalle;
