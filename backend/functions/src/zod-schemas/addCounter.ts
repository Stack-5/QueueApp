import { number, object, string, enum as zEnum } from "zod";

const cashierEmployeeSchema = object({
  uid: string(),
  role: zEnum(["cashier", "admin"]).default("cashier"),
});

export const addCounterSchema = object({
  counterNumber: number().int().positive(),
  cashierEmployee: cashierEmployeeSchema.optional(),
});
