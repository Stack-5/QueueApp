import { number, object, string } from "zod";

export const addCounterSchema = object({
  counterNumber: number().int().positive(),
  employeeUID: string().optional(),
});
