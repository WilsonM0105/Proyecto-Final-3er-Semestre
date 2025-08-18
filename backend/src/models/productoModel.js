import pool from "../config/db.js";
import { buildProductsQuery } from "../utils/helpers.js";

/** Listado con filtros y orden */
export async function listProductos({ categoria, q, sort } = {}, client = null) {
  const { sql, params } = buildProductsQuery({ categoria, q, sort });
  const { rows } = client ? await client.query(sql, params) : await pool.query(sql, params);
  return rows;
}

/** Detalle por id */
export async function getProductoById(id, client = null) {
  const q = `
    SELECT p.*, c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
     WHERE p.id=$1
  `;
  const { rows } = client ? await client.query(q, [id]) : await pool.query(q, [id]);
  return rows[0] || null;
}

/** Asegura categoría y devuelve id */
export async function ensureCategoria(nombre, client = null) {
  const q = `
    INSERT INTO categorias(nombre) VALUES ($1)
    ON CONFLICT (nombre) DO UPDATE SET nombre=EXCLUDED.nombre
    RETURNING id
  `;
  const { rows } = client ? await client.query(q, [nombre]) : await pool.query(q, [nombre]);
  return rows[0].id;
}

/** Crear producto */
export async function createProducto(data, client = null) {
  const {
    nombre, descripcion = null, precio, imagen = null,
    estado = "disponible", categoriaNombre, stock = 0
  } = data;

  if (!nombre || precio == null || !categoriaNombre) {
    throw new Error("Datos incompletos (nombre, precio, categoriaNombre)");
  }

  const categoria_id = await ensureCategoria(categoriaNombre, client);

  const q = `
    INSERT INTO productos(nombre, descripcion, precio, imagen, estado, categoria_id, stock)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;
  const params = [nombre, descripcion, precio, imagen, estado, categoria_id, stock];
  const { rows } = client ? await client.query(q, params) : await pool.query(q, params);
  return rows[0];
}

/** Actualizar producto */
export async function updateProducto(id, data, client = null) {
  const {
    nombre = null, descripcion = null, precio = null, imagen = null,
    estado = null, categoriaNombre = null, stock = null
  } = data;

  let categoria_id = null;
  if (categoriaNombre) {
    categoria_id = await ensureCategoria(categoriaNombre, client);
  }

  const q = `
    UPDATE productos
       SET nombre       = COALESCE($1, nombre),
           descripcion  = COALESCE($2, descripcion),
           precio       = COALESCE($3, precio),
           imagen       = COALESCE($4, imagen),
           estado       = COALESCE($5, estado),
           categoria_id = COALESCE($6, categoria_id),
           stock        = COALESCE($7, stock)
     WHERE id=$8
     RETURNING *
  `;
  const params = [nombre, descripcion, precio, imagen, estado, categoria_id, stock, id];
  const { rows } = client ? await client.query(q, params) : await pool.query(q, params);
  return rows[0] || null;
}

/** Eliminar producto */
export async function deleteProducto(id, client = null) {
  const q = "DELETE FROM productos WHERE id=$1";
  const result = client ? await client.query(q, [id]) : await pool.query(q, [id]);
  return result.rowCount > 0;
}

/** Cambiar estado (disponible | no_disponible) */
export async function changeEstadoProducto(id, estado, client = null) {
  if (!["disponible", "no_disponible"].includes(estado)) {
    throw new Error("Estado inválido");
  }
  const q = "UPDATE productos SET estado=$1 WHERE id=$2 RETURNING *";
  const { rows } = client ? await client.query(q, [estado, id]) : await pool.query(q, [estado, id]);
  return rows[0] || null;
}
