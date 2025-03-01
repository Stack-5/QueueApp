import { number, object, string, enum as zEnum} from "zod";

export const addToQueueSchema = object({
  queueID: number().int().positive(),
  purpose: zEnum(["payment", "inqure"]).default("payment"),
  cellphoneNumber: string(),
  timestamp: number(),
  customerStatus: zEnum(["pending", "complete"]).default("pending"),
});
