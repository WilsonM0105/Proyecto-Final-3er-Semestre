import { crearPedidoModel } from "../models/pedidoModel.js";
import { withTransaction } from "../utils/helpers.js";

// POST /api/pedidos
// Body: { items: [{ producto_id, cantidad }, ...] }
export async function crearPedido(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Items vacíos" });
  }

  try {
    const result = await withTransaction(async (client) => {
      return await crearPedidoModel({ userId: req.user.id, items }, client);
    }, req.user?.email);

    return res.status(201).json(result); // { pedido_id }
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message || "Error creando pedido" });
  }
}
