import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getActivePanel, createPanel, updateStatusPanel, getFinishedPanel } from "../controllers/panel.controller.js";

const router = Router();

router.post("/dashboard/panel", authMiddleware, createPanel);
router.get("/dashboard/panel/active", authMiddleware, getActivePanel);
router.get("/dashboard/panel/finished", authMiddleware, getFinishedPanel)
router.patch("/dashboard/panel/status", authMiddleware, updateStatusPanel)

export default router;