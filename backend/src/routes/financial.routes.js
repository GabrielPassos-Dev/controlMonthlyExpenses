import { Router } from "express";
import { getFinancial, deleteExpense, createExpense, updateExpensePaid, updateSpentAmount } from "../controllers/financial.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/financial", authMiddleware, createExpense);
router.get("/financial", authMiddleware, getFinancial);
router.delete("/financial/:id", authMiddleware, deleteExpense);
router.patch("/expenses/:id/paid", authMiddleware, updateExpensePaid);
router.patch("/expenses/:id/spentamount", authMiddleware, updateSpentAmount);

export default router;