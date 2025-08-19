import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function ProductoCard({ producto }) {
  const location = useLocation();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const disponible = producto.estado === "disponible";

  return (
    <article className="card">
      <img
        className="card-img"
        src={producto.imagen}
        alt={producto.nombre}
        loading="lazy"
      />

      <div className="card-body">
        <h3 style={{ margin: 0 }}>{producto.nombre}</h3>

        <p className="muted" style={{ margin: 0 }}>
          <strong>Precio:</strong> ${Number(producto.precio).toFixed(2)}
        </p>
        <p className="muted" style={{ margin: 0 }}>
          <strong>Categoría:</strong> {producto.categoria}
        </p>

        <p style={{ marginTop: ".4rem" }}>
          <span className={`chip ${disponible ? "chip--ok" : "chip--off"}`}>
            {disponible ? "Disponible" : "No disponible"}
          </span>
        </p>

        <div className="card-footer">
          <Link className="btn btn-secondary" to={`/producto/${producto.id}${location.search}`}>
            Ver detalle
          </Link>

          <button
            className="btn btn-primary"
            disabled={!disponible}
            onClick={() => {
              addItem(producto, 1);
              showToast("Producto añadido al carrito", "success");
            }}
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductoCard;
