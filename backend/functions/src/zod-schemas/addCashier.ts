import { boolean, object, string, enum as zEnum} from "zod";

export const addCashierSchema = object({
  name: string(),
  description: string(),
  activated: boolean().default(false),
  type: zEnum(["payment", "auditing", "clinic", "registrar"]).default("payment"),
});
