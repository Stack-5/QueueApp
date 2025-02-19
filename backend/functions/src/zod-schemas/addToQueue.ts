import { number, object, string } from "zod";

export const addToQueueSchema = object({
  queueID: number(),
  purpose: string(),
  cellphoneNumber: string(),
  timestamp: number(),
});
