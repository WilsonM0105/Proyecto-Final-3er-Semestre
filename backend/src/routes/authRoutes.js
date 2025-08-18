import { Router } from "express";
import { login, register, me } from "../controllers/authController.js";
import { authRequired } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authRequired, me);

export default router;
