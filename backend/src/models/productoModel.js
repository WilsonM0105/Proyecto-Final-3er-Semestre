import pool from "../config/db.js";

/** ===================== Helpers locales ===================== **/
async function resolveCategoriaId({ categoria_id, categoriaNombre }, client) {
  if (categoria_id != null && categoria_id !== "") {
    return Number(categoria_id);
  }
  if (categoriaNombre && categoriaNombre.trim()) {
    const { rows } = await client.query(
      "SELECT id FROM categorias WHERE nombre = $1",
      [categoriaNombre.trim()]
    );
    if (!rows.length) {
      throw new Error("La categoría indicada no existe");
    }
    return rows[0].id;
  }
  return null;
}

/** ===================== Consultas ===================== **/

/** Listado con filtros y orden (soporta categoriaId o categoria por nombre) */
export async function listProductos(
  { categoriaId, categoria, q, sort } = {},
  client = null
) {
  const c = client || (await pool.connect());
  try {
    const params = [];
    const where = [];

    if (categoriaId) {
      params.push(Number(categoriaId));
      where.push(`c.id = $${params.length}`);     // ✅ filtra por ID de categoría
    } else if (categoria) {
      params.push(categoria);
      where.push(`c.nombre = $${params.length}`);
    }

    if (q && q.trim()) {
      params.push(`%${q.trim()}%`);
      where.push(
        `(p.nombre ILIKE $${params.length} OR p.descripcion ILIKE $${params.length})`
      );
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

    const { rows } = await c.query(sql, params);
    return rows;
  } finally {
    if (!client) c.release();
  }
}

/** Detalle por id (incluye categoria_id) */
export async function getProductoById(id, client = null) {
  const c = client || (await pool.connect());
  try {
    const q = `
      SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen, p.estado, p.stock,
             c.id AS categoria_id, c.nombre AS categoria
        FROM productos p
        JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id=$1
    `;
    const { rows } = await c.query(q, [id]);
    return rows[0] || null;
  } finally {
    if (!client) c.release();
  }
}

/** Crear producto (acepta categoria_id o categoriaNombre) */
export async function createProducto(data, client = null) {
  const {
    nombre,
    descripcion = null,
    precio,
    imagen = null,
    estado = "disponible",
    stock = 0,
  } = data || {};

  const c = client || (await pool.connect());
  try {
    if (!nombre || precio == null) {
      throw new Error("Datos incompletos (nombre, precio)");
    }

    const categoriaId = await resolveCategoriaId(data, c);
    if (!categoriaId) {
      throw new Error("Debes enviar categoria_id o categoriaNombre");
    }

    const q = `
      INSERT INTO productos(nombre, descripcion, precio, imagen, estado, categoria_id, stock)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
    `;
    const params = [
      nombre.trim(),
      descripcion,
      Number(precio),
      imagen,
      estado,
      categoriaId,
      Number(stock),
    ];
    const { rows } = await c.query(q, params);
    return await getProductoById(rows[0].id, c);
  } finally {
    if (!client) c.release();
  }
}

/** Actualizar producto (acepta categoria_id o categoriaNombre) */
export async function updateProducto(id, data, client = null) {
  const {
    nombre = null,
    descripcion = null,
    precio = null,
    imagen = null,
    estado = null,
    stock = null,
  } = data || {};

  const c = client || (await pool.connect());
  try {
    // Resolver categoría si viene por id/nombre
    const categoriaId = await resolveCategoriaId(data, c);

    const sets = [];
    const params = [];
    let i = 1;

    if (nombre !== null) {
      sets.push(`nombre = $${i++}`);
      params.push(nombre.trim());
    }
    if (descripcion !== null) {
      sets.push(`descripcion = $${i++}`);
      params.push(descripcion);
    }
    if (precio !== null) {
      sets.push(`precio = $${i++}`);
      params.push(Number(precio));
    }
    if (imagen !== null) {
      sets.push(`imagen = $${i++}`);
      params.push(imagen);
    }
    if (estado !== null) {
      sets.push(`estado = $${i++}`);
      params.push(estado);
    }
    if (stock !== null) {
      sets.push(`stock = $${i++}`);
      params.push(Number(stock));
    }
    if (categoriaId !== null) {
      sets.push(`categoria_id = $${i++}`);
      params.push(categoriaId);
    }

    if (!sets.length) {
      return await getProductoById(id, c);
    }

    params.push(id);
    const q = `UPDATE productos SET ${sets.join(", ")} WHERE id = $${i} RETURNING id`;
    const up = await c.query(q, params);
    if (!up.rowCount) return null;

    return await getProductoById(id, c);
  } finally {
    if (!client) c.release();
  }
}

/** Eliminar producto */
export async function deleteProducto(id, client = null) {
  const c = client || (await pool.connect());
  try {
    const q = "DELETE FROM productos WHERE id=$1";
    const result = await c.query(q, [id]);
    return result.rowCount > 0;
  } finally {
    if (!client) c.release();
  }
}

/** Cambiar estado (disponible | no_disponible) */
export async function changeEstadoProducto(id, estado, client = null) {
  if (!["disponible", "no_disponible"].includes(estado)) {
    throw new Error("Estado inválido");
  }
  const c = client || (await pool.connect());
  try {
    const q = "UPDATE productos SET estado=$1 WHERE id=$2 RETURNING id";
    const { rows } = await c.query(q, [estado, id]);
    if (!rows.length) return null;
    return await getProductoById(id, c);
  } finally {
    if (!client) c.release();
  }
}
