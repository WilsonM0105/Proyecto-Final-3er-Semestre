import express from "express";
import cors from "cors";
// (Opcional) import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";

const app = express();

// app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, name: "Tienda Virtual API" }));

app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);

export default app;
