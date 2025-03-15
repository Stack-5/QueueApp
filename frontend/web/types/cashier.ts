import CashierType from "./CashierType";

type Cashier = {
  id: string;
  name:string;
  description:string;
  queueSize: number;
  activated: true;
  type: CashierType;
};

export default Cashier;