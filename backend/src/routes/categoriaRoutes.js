import { Router } from "express";
import { listarCategorias, crearCategoria } from "../controllers/categoriaController.js";
import { authRequired, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Listar todas (público)
router.get("/", listarCategorias);

// Crear categoría (admin)
router.post("/", authRequired, requireAdmin, crearCategoria);

export default router;
