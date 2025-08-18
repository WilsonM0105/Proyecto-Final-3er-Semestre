import {
  listProductos,
  getProductoById as getProductoByIdModel,
  createProducto,
  updateProducto,
  deleteProducto,
  changeEstadoProducto
} from "../models/productoModel.js";
import { withTransaction } from "../utils/helpers.js";

// GET /api/productos
export async function getProductos(req, res) {
  try {
    const { categoria, q, sort } = req.query;
    const productos = await listProductos({ categoria, q, sort });
    return res.json(productos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error listando productos" });
  }
}

// GET /api/productos/:id
export async function getProductoById(req, res) {
  try {
    const { id } = req.params;
    const prod = await getProductoByIdModel(id);
    if (!prod) return res.status(404).json({ error: "No encontrado" });
    return res.json(prod);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error obteniendo producto" });
  }
}

// POST /api/productos  (admin)
export async function crearProducto(req, res) {
  const data = req.body; // { nombre, descripcion, precio, imagen, estado, categoriaNombre, stock }
  try {
    const nuevo = await withTransaction(async (client) => {
      return await createProducto(data, client);
    }, req.user?.email);
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    const msg = err.message?.includes("Datos incompletos") ? err.message : "Error creando producto";
    return res.status(400).json({ error: msg });
  }
}

// PUT /api/productos/:id  (admin)
export async function actualizarProducto(req, res) {
  const { id } = req.params;
  const data = req.body; // campos opcionales
  try {
    const actualizado = await withTransaction(async (client) => {
      return await updateProducto(id, data, client);
    }, req.user?.email);

    if (!actualizado) return res.status(404).json({ error: "No encontrado" });
    return res.json(actualizado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error actualizando producto" });
  }
}

// DELETE /api/productos/:id  (admin)
export async function eliminarProducto(req, res) {
  const { id } = req.params;
  try {
    const ok = await withTransaction(async (client) => {
      return await deleteProducto(id, client);
    }, req.user?.email);

    if (!ok) return res.status(404).json({ error: "No encontrado" });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error eliminando producto" });
  }
}

// PATCH /api/productos/:id/estado  (admin)
export async function cambiarEstadoProducto(req, res) {
  const { id } = req.params;
  const { estado } = req.body; // 'disponible' | 'no_disponible'
  try {
    const actualizado = await withTransaction(async (client) => {
      return await changeEstadoProducto(id, estado, client);
    }, req.user?.email);

    if (!actualizado) return res.status(404).json({ error: "No encontrado" });
    return res.json(actualizado);
  } catch (err) {
    console.error(err);
    const msg = err.message?.includes("Estado inválido") ? err.message : "Error cambiando estado";
    return res.status(400).json({ error: msg });
  }
}
