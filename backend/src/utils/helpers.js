import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

/** Hash & compare */
export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}
export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/** JWT helpers */
export function signToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/** Ejecuta una transacción. Si pasas userEmail, setea app.user_email para auditoría. */
export async function withTransaction(cb, userEmail = null) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (userEmail) {
      await client.query(
        "SELECT set_config('app.user_email', $1, true)",
        [userEmail]
      );
    }
    const result = await cb(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    throw err;
  } finally {
    client.release();
  }
}

/** Construye SQL dinámico para listado de productos con filtros/sort. */
export function buildProductsQuery({ categoria, categoriaId, q, sort } = {}) {
  const params = [];
  const where = [];

  if (categoriaId) {
    params.push(Number(categoriaId));
    where.push(`c.id = $${params.length}`);
  } else if (categoria) {
    params.push(categoria);
    where.push(`c.nombre = $${params.length}`);
  }

  if (q && q.trim()) {
    params.push(`%${q.trim()}%`);
    where.push(`(p.nombre ILIKE $${params.length} OR p.descripcion ILIKE $${params.length})`);
  }

  let sql = `
    SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.estado, p.stock,
           c.id AS categoria_id, c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
  `;
  if (where.length) sql += ` WHERE ${where.join(" AND ")}`;

  const sortMap = {
    "nombre-asc": "p.nombre ASC",
    "nombre-desc": "p.nombre DESC",
    "precio-asc": "p.precio ASC",
    "precio-desc": "p.precio DESC",
    "estado": "CASE WHEN p.estado='disponible' THEN 0 ELSE 1 END, p.nombre ASC",
  };
  sql += ` ORDER BY ${sortMap[sort] || "p.nombre ASC"}`;

  return { sql, params };
}

