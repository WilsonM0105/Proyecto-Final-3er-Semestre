import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { apiGet } from "../api/client";
import { useCart } from "../context/CartContext";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search;
  const { addItem } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleVolver = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/${search || ""}`, { replace: true });
  };

  useEffect(() => {
    setLoading(true);
    apiGet(`/api/productos/${id}`)
      .then(setProducto)
      .catch(() => setProducto(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="container"><p className="muted">Cargando…</p></main>
      </div>
    );
  }

  if (!producto) {
    return (
      <div>
        <Header />
        <main className="container">
          <section className="section">
            <p>Producto no encontrado.</p>
            <button className="btn btn-secondary" type="button" onClick={handleVolver}>
              ← Volver
            </button>
          </section>
        </main>
      </div>
    );
  }

  const esDisponible = producto.estado === "disponible";

  return (
    <div>
      <Header />
      <main className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: ".75rem" }}>
          <button className="btn btn-secondary" type="button" onClick={handleVolver}>
            ← Volver
          </button>
        </div>

        <section className="section">
          <img
            className="detail-img"
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
          />

          <h2 style={{ marginTop: "1rem" }}>{producto.nombre}</h2>
          <p><strong>Descripción:</strong> {producto.descripcion}</p>
          <p><strong>Precio:</strong> ${Number(producto.precio).toFixed(2)}</p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`chip ${esDisponible ? "chip--ok" : "chip--off"}`}>
              {esDisponible ? "Disponible" : "No disponible"}
            </span>
          </p>

          <button
            className="btn btn-primary"
            disabled={!esDisponible}
            onClick={() =>
              addItem(
                {
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: Number(producto.precio),
                  imagen: producto.imagen,
                },
                1
              )
            }
          >
            Añadir al carrito
          </button>
        </section>
      </main>
    </div>
  );
}
export default ProductoDetalle;
