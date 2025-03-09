import { StationType } from "@type/station";
import { Dispatch, SetStateAction } from "react";

type StationTypeOptionType = {
  key: number;
  stationTypeName: StationType;
};
export const stationTypeOption: StationTypeOptionType[] = [
  {
    key: 1,
    stationTypeName: "payment",
  },
  {
    key: 2,
    stationTypeName: "clinic",
  },
  {
    key: 3,
    stationTypeName: "auditing",
  },
  {
    key: 4,
    stationTypeName: "registrar",
  },
];

export const chooseStationType = (
  key: number,
  setter: Dispatch<SetStateAction<StationType>>
) => {
  switch (key) {
    case 1:
      setter("payment");
      break;
    case 2:
      setter("clinic");
      break;
    case 3:
      setter("auditing");
      break;
    case 4:
      setter("registrar");
      break;
  }
};
