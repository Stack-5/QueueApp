import { number, object, string, enum as zEnum} from "zod";

export const addToQueueSchema = object({
  purpose: zEnum(["payment", "auditing", "clinic", "registrar"]).default("payment"),
  cellphoneNumber: string(),
  timestamp: number().default(() => Date.now()),
  customerStatus: zEnum(["pending", "complete"]).default("pending"),
  stationID: string(),
});
