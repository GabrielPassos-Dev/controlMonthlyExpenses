import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { updateSalaryUser } from "../controllers/user.controller.js";

const router = Router();

router.patch("/user/salary", authMiddleware, updateSalaryUser);

export default router;