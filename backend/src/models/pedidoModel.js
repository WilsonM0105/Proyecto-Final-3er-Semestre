import pool from "../config/db.js";

/**
 * Crea pedido llamando al SP sp_crear_pedido.
 * items: [{ producto_id, cantidad }]
 * Devuelve: { pedido_id }
 */
export async function crearPedidoModel({ userId, items }, client = null) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items vacíos");
  }
  const q = "SELECT sp_crear_pedido($1, $2::jsonb) AS id";
  const params = [userId, JSON.stringify(items)];
  const { rows } = client ? await client.query(q, params) : await pool.query(q, params);
  return { pedido_id: rows[0].id };
}
