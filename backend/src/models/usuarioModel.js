import pool from "../config/db.js";

/** Busca usuario por email (o null) */
export async function getByEmail(email, client = null) {
  const q = "SELECT * FROM usuarios WHERE email=$1";
  const { rows } = client ? await client.query(q, [email]) : await pool.query(q, [email]);
  return rows[0] || null;
}

/** Existe email */
export async function emailExists(email, client = null) {
  const q = "SELECT 1 FROM usuarios WHERE email=$1";
  const r = client ? await client.query(q, [email]) : await pool.query(q, [email]);
  return r.rowCount > 0;
}

/** Crea usuario (devuelve id,nombre,email,rol) */
export async function createUser({ nombre, email, passwordHash, rol = "user" }, client = null) {
  const q = `
    INSERT INTO usuarios(nombre,email,password_hash,rol)
    VALUES ($1,$2,$3,$4)
    RETURNING id, nombre, email, rol
  `;
  const params = [nombre, email, passwordHash, rol];
  const { rows } = client ? await client.query(q, params) : await pool.query(q, params);
  return rows[0];
}

/** Busca por id (o null) */
export async function getById(id, client = null) {
  const q = "SELECT id, nombre, email, rol FROM usuarios WHERE id=$1";
  const { rows } = client ? await client.query(q, [id]) : await pool.query(q, [id]);
  return rows[0] || null;
}
