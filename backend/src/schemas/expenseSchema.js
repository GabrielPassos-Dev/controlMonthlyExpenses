import { z } from "zod";

export const updateExpenseSchema = z.object({
    name: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    spentAmount: z.number().min(0).optional()
});