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
    if (items.length === 0) {
      // si no hay nada en el carrito, regresar al carrito
      navigate("/carrito", { replace: true });
    }
  }, [items, navigate]);

  const currency = (n) =>
    n.toLocaleString("es-EC", { style: "currency", currency: "USD" });

  const confirmarCompra = () => {
    // aquí, en backend real, enviarías el pedido
    clearCart();
    showToast("¡Compra realizada con éxito! Gracias por tu pedido 🙌", "success");
    navigate("/", { replace: true });
  };

  return (
    <div>
      <Header />
      <main style={{ padding: "1rem", maxWidth: "900px", margin: "auto" }}>
        <h2>Resumen de compra</h2>

        {items.length > 0 && (
          <>
            <table border="0" cellPadding="10" style={{ width: "100%", background: "#fff", borderRadius: "10px", boxShadow: "0 8px 28px rgba(0,0,0,.06)" }}>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      <img src={i.imagen} alt={i.nombre} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
                      <span>{i.nombre}</span>
                    </td>
                    <td>{currency(i.precio)}</td>
                    <td>{i.qty}</td>
                    <td>{currency(i.qty * i.precio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ textAlign: "right" }}>
                <div><strong>Artículos:</strong> {totalItems}</div>
                <div><strong>Total a pagar:</strong> {currency(totalPrice)}</div>
              </div>
              <button onClick={confirmarCompra} style={{ background: "#10b981", color: "#111", border: "none", borderRadius: "10px", padding: ".6rem 1rem", cursor: "pointer", fontWeight: 700 }}>
                Confirmar compra
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Resumen;
