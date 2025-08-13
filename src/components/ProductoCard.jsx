import { Link, useLocation } from "react-router-dom";

function ProductoCard({ producto }) {
  const location = useLocation(); // para leer el ?cat actual

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px", backgroundColor: "#f9f9f9", width: "300px" }}>
      <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
      <h3>{producto.nombre}</h3>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      <p>
        <strong>Estado:</strong>{" "}
        <span style={{ color: producto.estado === "disponible" ? "green" : "red" }}>
          {producto.estado}
        </span>
      </p>

      {/* Mantiene el query ?cat=... */}
      <Link to={`/producto/${producto.id}${location.search}`}>Ver detalle</Link>
    </div>
  );
}

export default ProductoCard;
