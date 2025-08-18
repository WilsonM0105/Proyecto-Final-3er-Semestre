import { emailExists, createUser, getByEmail } from "../models/usuarioModel.js";
import { hashPassword, comparePassword, signToken, withTransaction } from "../utils/helpers.js";

// POST /api/auth/register
export async function register(req, res) {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const result = await withTransaction(async (client) => {
      if (await emailExists(email, client)) {
        return { status: 409, payload: { error: "Email ya registrado" } };
      }
      const passwordHash = await hashPassword(password);
      const user = await createUser({ nombre, email, passwordHash }, client);
      const token = signToken({ id: user.id, email: user.email, rol: user.rol });
      return { status: 200, payload: { user, token } };
    }, email);

    return res.status(result.status).json(result.payload);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en registro" });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const u = await getByEmail(email);
    if (!u) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await comparePassword(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = signToken({ id: u.id, email: u.email, rol: u.rol });
    return res.json({
      user: { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en login" });
  }
}

// GET /api/auth/me
export async function me(req, res) {
  return res.json({ user: req.user });
}
