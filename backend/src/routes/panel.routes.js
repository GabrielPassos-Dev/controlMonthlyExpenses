import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getActivePanel, createPanel, updateStatusPanel } from "../controllers/panel.controller.js";

const router = Router();

router.post("/dashboard/panel", authMiddleware, createPanel);
router.get("/dashboard/panel/active", authMiddleware, getActivePanel);
router.patch("/panel/inactive", authMiddleware, updateStatusPanel)

export default router;