import { Router } from "express";
import { getFinancial, deleteExpense, createExpense, updateExpensePaid } from "../controllers/financial.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/financial", authMiddleware, createExpense);
router.get("/financial", authMiddleware, getFinancial);
router.delete("/financial/:id", authMiddleware, deleteExpense);
router.patch("/expenses/:id/paid", authMiddleware, updateExpensePaid);

export default router;