import { number, object, string, enum as zEnum } from "zod";

export const addToQueueSchema = object({
  purpose: zEnum(["payment", "auditing", "clinic", "registrar"]).default(
    "payment"
  ),
  email: string().email("Invalid email format"),
  timestamp: number().default(() => Date.now()),
  customerStatus: zEnum(["pending", "ongoing", "complete"]).default("pending"),
  stationID: string().min(1, "Station ID cannot be empty"),
});
