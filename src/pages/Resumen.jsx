import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Resumen() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) navigate("/carrito", { replace: true });
  }, [items, navigate]);

  const currency = (n) =>
    n.toLocaleString("es-EC", { style: "currency", currency: "USD" });

  const confirmarCompra = () => {
    clearCart();
    showToast("¡Compra realizada con éxito! Gracias por tu pedido 🙌", "success");
    navigate("/", { replace: true });
  };

  return (
    <div>
      <Header />
      <main className="container">
        <h2 className="title-lg">Resumen de compra</h2>

        {items.length > 0 && (
          <>
            <section className="section">
              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i) => (
                      <tr key={i.id}>
                        <td style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                          <img
                            src={i.imagen}
                            alt={i.nombre}
                            style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
                          />
                          <span>{i.nombre}</span>
                        </td>
                        <td>{currency(i.precio)}</td>
                        <td>{i.qty}</td>
                        <td>{currency(i.qty * i.precio)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ textAlign: "right" }}>
                  <div><strong>Artículos:</strong> {totalItems}</div>
                  <div><strong>Total a pagar:</strong> {currency(totalPrice)}</div>
                </div>
                <button className="btn btn-primary" onClick={confirmarCompra}>
                  Confirmar compra
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Resumen;
