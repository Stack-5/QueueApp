import { Dispatch, SetStateAction } from "react";
import EmployeeRole from "../types/role";

export const options = [
  { key: 1, roleName: "Admin" },
  { key: 2, roleName: "Cashier" },
  { key: 3, roleName: "Information" },
];

export const chooseRole = (
  key: number,
  setter: Dispatch<SetStateAction<EmployeeRole>>
) => {
  switch (key) {
    case 1:
      setter("admin");
      break;
    case 2:
      setter("cashier");
      break;
    case 3:
      setter("information");
      break;
  }
};
