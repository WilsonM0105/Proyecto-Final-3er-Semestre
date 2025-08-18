import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token faltante" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, rol }
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function isAdmin(req, res, next) {
  if (req.user?.rol !== "admin") return res.status(403).json({ error: "Solo admin" });
  next();
}
