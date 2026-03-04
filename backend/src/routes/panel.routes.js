import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { activePanel, createPanel } from "../controllers/panel.controller.js";

const router = Router();

router.post("/dashboard/panel", authMiddleware, createPanel);
router.get("/dashboard/panel/active", authMiddleware, activePanel);

export default router;