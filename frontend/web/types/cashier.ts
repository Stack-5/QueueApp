import CashierType from "./cashierType";

type Cashier = {
  id: string;
  name:string;
  description:string;
  queueSize: number;
  activated: true;
  type: CashierType;
};

export default Cashier;