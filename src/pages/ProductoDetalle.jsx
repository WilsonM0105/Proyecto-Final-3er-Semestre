import { useParams, useNavigate, useLocation } from "react-router-dom";
import { productos } from "../data/productos";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const producto = productos.find((p) => p.id === parseInt(id, 10));
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleVolver = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/${search || ""}`, { replace: true });
  };

  if (!producto) {
    return (
      <div>
        <Header />
        <main className="container section">
          <p>Producto no encontrado.</p>
          <div style={{ display:"flex", gap:".5rem" }}>
            <button className="btn btn-secondary" onClick={handleVolver}>← Volver</button>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Volver al inicio</button>
          </div>
        </main>
      </div>
    );
  }

  const esDisponible = producto.estado === "disponible";

  return (
    <div>
      <Header />
      <main className="container section" style={{ maxWidth: 760 }}>
        <div style={{ marginBottom: ".75rem", display:"flex", gap:".5rem" }}>
          <button className="btn btn-secondary" onClick={handleVolver}>← Volver</button>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Volver al inicio</button>
        </div>

        <img className="card-img" src={producto.imagen} alt={`Imagen del producto ${producto.nombre}`} style={{ borderRadius: "12px" }} />
        <h2 className="title-lg">{producto.nombre}</h2>
        <p className="muted"><strong>Descripción:</strong> {producto.descripcion}</p>
        <p className="muted">
          <strong>Precio:</strong> <span style={{ color:"var(--success)", fontWeight:700 }}>${producto.precio}</span>
        </p>
        <p className="muted"><strong>Categoría:</strong> {producto.categoria}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span className={`chip ${esDisponible ? "chip--ok":"chip--off"}`}>
            {esDisponible ? "Disponible" : "No disponible"}
          </span>
        </p>

        <div>
          <button
            className="btn btn-primary"
            disabled={!esDisponible}
            onClick={() => { addItem(producto, 1); showToast("Producto añadido al carrito","success"); }}
          >
            Añadir al carrito
          </button>
        </div>
      </main>
    </div>
  );
}
export default ProductoDetalle;
