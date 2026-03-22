import { z } from "zod";

export const updateExpenseSchema = z.object({
    name: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    spentAmount: z.number().min(0).optional()
});

export const createExpenseSchema = z.object({
    name: z.string().min(1, "Informe o nome da despesa"),
    amount: z.coerce
        .number()
        .gt(0, "O valor deve ser maior que zero"),
    type: z.enum(["FIXED", "VARIABLE"], {
        errorMap: () => ({ message: "Tipo de despesa inválido" })
    })
});

const objectId = z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/);

export const deleteExpenseSchema = z.object({
    id: objectId
});

export const updatePaidSchema = z.object({
    id: objectId,
    paid: z.coerce.boolean()
});