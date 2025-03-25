import { number, object, string, enum as zEnum } from "zod";

export const addToQueueSchema = object({
  purpose: zEnum(["payment", "auditing", "clinic", "registrar"]).default(
    "payment"
  ),
  cellphoneNumber: string().regex(
    /^\+63\d{10}$/,
    "Invalid phone number format. Use +63XXXXXXXXXX"
  ),
  timestamp: number().default(() => Date.now()),
  customerStatus: zEnum(["pending", "ongoing", "complete"]).default("pending"),
  stationID: string(),
});
