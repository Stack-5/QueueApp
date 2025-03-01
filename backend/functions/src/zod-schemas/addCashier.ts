import { boolean, object, string } from "zod";

export const addCashierSchema = object({
  name: string(),
  description: string(),
  activated: boolean().default(false),
});
