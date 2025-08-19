import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" ");
    if (!token) {
      return res.status(401).json({ error: "Token requerido" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Falta JWT_SECRET en el backend" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload típicamente: { id, email, rol, iat, exp }
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  if (req.user.rol !== "admin") {
    return res.status(403).json({ error: "Requiere rol admin" });
  }
  return next();
}
