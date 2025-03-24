import CashierType from "./CashierType";

type Station = {
  name: string;
  description: string;
  type: CashierType;
  activated:boolean;
}

export default Station;
