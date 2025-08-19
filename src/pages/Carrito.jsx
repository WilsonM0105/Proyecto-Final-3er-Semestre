import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { apiPost } from "../api/client";

function LineaCarrito({ item, onDec, onInc, onSetQty, onRemove }) {
  const subtotal = useMemo(() => (item.precio * item.qty).toFixed(2), [item]);

  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: "64px 1fr auto",
        gap: "1rem",
        alignItems: "center",
        padding: ".75rem 0",
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      <img
        src={item.imagen}
        alt={item.nombre}
        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
      />

      <div>
        <h4 style={{ margin: 0 }}>{item.nombre}</h4>
        <small className="muted">Precio unitario: ${item.precio}</small>
        <div style={{ marginTop: ".35rem", display: "flex", gap: ".5rem", alignItems: "center" }}>
          <button className="btn btn-secondary" type="button" onClick={() => onDec(item.id)} aria-label={`Disminuir ${item.nombre}`}>
            −
          </button>
          <input
            className="input"
            type="number"
            min={1}
            value={item.qty}
            onChange={(e) => onSetQty(item.id, Math.max(1, parseInt(e.target.value || "1", 10)))}
            style={{ width: 80, textAlign: "center" }}
            aria-label={`Cantidad de ${item.nombre}`}
          />
          <button className="btn btn-secondary" type="button" onClick={() => onInc(item.id)} aria-label={`Incrementar ${item.nombre}`}>
            +
          </button>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 600 }}>${subtotal}</div>
        <button
          className="btn btn-danger"
          type="button"
          onClick={() => onRemove(item.id)}
          style={{ marginTop: ".35rem" }}
          aria-label={`Eliminar ${item.nombre} del carrito`}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}

export default function Carrito() {
  const { items, totalPrice, setQty, inc, dec, removeItem, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState({ loading: false, error: "", ok: "" });

  const handleCheckout = async () => {
    if (!user || !token) {
      alert("Debes iniciar sesión para comprar.");
      navigate("/login");
      return;
    }
    if (items.length === 0) return;

    try {
      setStatus({ loading: true, error: "", ok: "" });

      // Backend espera: items: [{ producto_id, cantidad }]
      const payload = {
        items: items.map((i) => ({
          producto_id: i.id,
          cantidad: i.qty
        }))
      };

      const { pedido_id } = await apiPost("/api/pedidos", payload, token);

      const resumen = {
        pedido_id,
        total: totalPrice,
        items
      };

      clearCart();
      setStatus({ loading: false, error: "", ok: `Pedido #${pedido_id} creado` });
      navigate("/resumen", { state: resumen });
    } catch (e) {
      console.error(e);
      setStatus({
        loading: false,
        error: "Ocurrió un problema procesando tu pedido. Intenta nuevamente.",
        ok: ""
      });
    }
  };

  return (
    <div>
      <Header />
      <main className="container">
        <h2 className="title-lg">🛒 Carrito</h2>

        {items.length === 0 ? (
          <section className="section">
            <p className="muted" style={{ margin: 0 }}>Tu carrito está vacío.</p>
            <button className="btn btn-primary" style={{ marginTop: ".75rem" }} type="button" onClick={() => navigate("/")}>
              Explorar productos
            </button>
          </section>
        ) : (
          <section className="section">
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map((item) => (
                <LineaCarrito
                  key={item.id}
                  item={item}
                  onDec={dec}
                  onInc={inc}
                  onSetQty={setQty}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap"
              }}
            >
              <button className="btn btn-secondary" type="button" onClick={() => navigate("/")} aria-label="Seguir comprando">
                ← Seguir comprando
              </button>

              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  Total: ${totalPrice.toFixed(2)}
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={status.loading || items.length === 0}
                  onClick={handleCheckout}
                  aria-busy={status.loading}
                  style={{ marginTop: ".5rem" }}
                >
                  {status.loading ? "Procesando..." : "Finalizar compra"}
                </button>
              </div>
            </div>

            {status.error && <p style={{ color: "#b91c1c", marginTop: ".75rem" }}>{status.error}</p>}
            {status.ok && <p style={{ color: "#16a34a", marginTop: ".75rem" }}>{status.ok}</p>}
          </section>
        )}
      </main>
    </div>
  );
}
