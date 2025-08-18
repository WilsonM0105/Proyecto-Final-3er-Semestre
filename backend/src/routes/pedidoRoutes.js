import { Router } from "express";
import { crearPedido } from "../controllers/pedidoController.js";
import { authRequired } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authRequired, crearPedido);

export default router;
