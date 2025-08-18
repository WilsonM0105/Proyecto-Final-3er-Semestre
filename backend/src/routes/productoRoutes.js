import { Router } from "express";
import {
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  cambiarEstadoProducto
} from "../controllers/productoController.js";
import { authRequired, isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Públicas
router.get("/", getProductos);
router.get("/:id", getProductoById);

// Admin
router.post("/", authRequired, isAdmin, crearProducto);
router.put("/:id", authRequired, isAdmin, actualizarProducto);
router.delete("/:id", authRequired, isAdmin, eliminarProducto);
router.patch("/:id/estado", authRequired, isAdmin, cambiarEstadoProducto);

export default router;
