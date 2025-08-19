// backend/src/routes/productoRoutes.js
import { Router } from "express";
import {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  cambiarEstadoProducto,
} from "../controllers/productoController.js";
import { authRequired, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Públicas
router.get("/", getProductos);
router.get("/:id", getProductoById);

// Admin
router.post("/", authRequired, requireAdmin, crearProducto);
router.put("/:id", authRequired, requireAdmin, actualizarProducto);
router.delete("/:id", authRequired, requireAdmin, eliminarProducto);
router.patch("/:id/estado", authRequired, requireAdmin, cambiarEstadoProducto);

export default router;
