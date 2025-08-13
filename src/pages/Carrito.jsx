import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Carrito() {
  const { items, inc, dec, setQty, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const currency = (n) => n.toLocaleString("es-EC", { style: "currency", currency: "USD" });

  return (
    <div>
      <Header />
      <main className="container">
        <h2 className="title-lg">Tu carrito</h2>

        {items.length === 0 ? (
          <div className="section center muted">
            El carrito está vacío.{" "}
            <button className="btn btn-primary" onClick={() => navigate("/")}>Ir al catálogo</button>
          </div>
        ) : (
          <>
            <div className="section" style={{ overflowX:"auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
                        <img src={i.imagen} alt={i.nombre} style={{ width:64, height:64, objectFit:"cover", borderRadius:8 }} />
                        <span>{i.nombre}</span>
                      </td>
                      <td>{currency(i.precio)}</td>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:".4rem" }}>
                          <button className="btn btn-secondary" onClick={() => dec(i.id)}>-</button>
                          <input
                            className="input"
                            type="number" min="1"
                            value={i.qty}
                            onChange={(e)=> setQty(i.id, parseInt(e.target.value||"1",10))}
                            style={{ width:70, textAlign:"center" }}
                          />
                          <button className="btn btn-secondary" onClick={() => inc(i.id)}>+</button>
                        </div>
                      </td>
                      <td>{currency(i.qty * i.precio)}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => removeItem(i.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="section" style={{ display:"flex", gap:"1rem", alignItems:"center", flexWrap:"wrap", justifyContent:"space-between" }}>
              <button className="btn btn-danger" onClick={clearCart}>Vaciar carrito</button>
              <div style={{ marginLeft:"auto", textAlign:"right" }}>
                <div><strong>Artículos:</strong> {totalItems}</div>
                <div><strong>Total:</strong> {currency(totalPrice)}</div>
                <button className="btn btn-primary" style={{ marginTop:".5rem" }} onClick={() => navigate("/resumen")}>
                  Finalizar compra
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
export default Carrito;
