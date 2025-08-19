import pool from "../config/db.js";
import { withTransaction } from "../utils/helpers.js";

export async function listarCategorias(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT id, nombre FROM categorias ORDER BY nombre ASC"
    );
    return res.json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error listando categorías" });
  }
}

export async function crearCategoria(req, res) {
  const { nombre } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ error: "Nombre requerido" });
  }
  try {
    const row = await withTransaction(async (client) => {
      const dup = await client.query("SELECT 1 FROM categorias WHERE nombre=$1", [nombre.trim()]);
      if (dup.rowCount) {
        return null;
      }
      const ins = await client.query(
        "INSERT INTO categorias(nombre) VALUES ($1) RETURNING id, nombre",
        [nombre.trim()]
      );
      return ins.rows[0];
    }, req.user?.email || "api");
    if (!row) return res.status(409).json({ error: "Categoría ya existe" });
    return res.status(201).json(row);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error creando categoría" });
  }
}
