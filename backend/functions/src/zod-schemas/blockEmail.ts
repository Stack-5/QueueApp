import { object, string } from "zod";

export const blockEmailSchema = object({
  email: string().email("Invalid email format"),
  reason: string().min(1, "Reason cannot be empty"),
});
