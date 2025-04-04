import { boolean, object, string, enum as zEnum} from "zod";

export const addCashierSchema = object({
  name: string().min(1, "Name is required"),
  description: string().min(1, "Description is required"),
  activated: boolean().default(false),
  type: zEnum(["payment", "auditing", "clinic", "registrar"]).default("payment"),
});
