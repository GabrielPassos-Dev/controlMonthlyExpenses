import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Informe seu nome"),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    salary: z.coerce.number().min(0, "O salário não pode ser negativo").optional(),
});

export const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres")
});