// backend/src/controllers/productoController.js
import pool from "../config/db.js";
import { withTransaction } from "../utils/helpers.js";
import {
  listProductos,
  getProductoById as getProdModel,
  createProducto,
  updateProducto,
  deleteProducto,
  changeEstadoProducto
} from "../models/productoModel.js";

export async function getProductos(req, res) {
  try {
    // 👇 ¡IMPORTANTE! incluir categoriaId
    const { categoriaId, categoria, q, sort } = req.query;
    const client = await pool.connect();
    try {
      const data = await listProductos({ categoriaId, categoria, q, sort }, client);
      return res.json(data);
    } finally {
      client.release();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error listando productos" });
  }
}

export async function getProductoById(req, res) {
  try {
    const id = Number(req.params.id);
    const client = await pool.connect();
    try {
      const p = await getProdModel(id, client);
      if (!p) return res.status(404).json({ error: "Producto no encontrado" });
      return res.json(p);
    } finally {
      client.release();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error obteniendo producto" });
  }
}

export async function crearProducto(req, res) {
  try {
    const email = req.user?.email || "api";
    const nuevo = await withTransaction(async (client) => {
      return await createProducto(req.body, client);
    }, email);
    return res.status(201).json(nuevo);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Error creando producto" });
  }
}

export async function actualizarProducto(req, res) {
  try {
    const id = Number(req.params.id);
    const email = req.user?.email || "api";
    const actualizado = await withTransaction(async (client) => {
      return await updateProducto(id, req.body, client);
    }, email);
    if (!actualizado) return res.status(404).json({ error: "Producto no encontrado" });
    return res.json(actualizado);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Error actualizando producto" });
  }
}

export async function eliminarProducto(req, res) {
  try {
    const id = Number(req.params.id);
    const email = req.user?.email || "api";
    const ok = await withTransaction(async (client) => {
      return await deleteProducto(id, client);
    }, email);

    if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
    return res.json({ ok: true });
  } catch (e) {
    if (e.code === "FK_PRODUCTO_EN_PEDIDOS") {
      return res.status(409).json({
        error:
          "No puedes eliminar este producto porque tiene ventas registradas. Márcalo como 'no_disponible'.",
      });
    }
    console.error(e);
    return res.status(500).json({ error: "Error eliminando producto" });
  }
}

export async function cambiarEstadoProducto(req, res) {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;
    if (!estado) return res.status(400).json({ error: "Estado requerido" });

    const email = req.user?.email || "api";
    const actualizado = await withTransaction(async (client) => {
      return await changeEstadoProducto(id, estado, client);
    }, email);

    if (!actualizado) return res.status(404).json({ error: "Producto no encontrado" });
    return res.json(actualizado);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: e.message || "Error cambiando estado" });
  }
}
