import { z } from "zod";

export const createPanelSchema = z.object({
    month: z.coerce
        .number()
        .gt(0, "O valor deve ser maior que zero"),
    year: z.coerce
        .number()
        .gt(0, "O valor deve ser maior que zero"),

});