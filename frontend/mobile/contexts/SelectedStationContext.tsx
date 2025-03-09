import Station from "@type/station";
import { createContext, Dispatch, ReactNode, SetStateAction, useState, FC, useContext} from "react";

type SelectedStationContextType = {
  selectedStation: Station | null;
  setSelectedStation: Dispatch<SetStateAction<Station | null>>;
}

const SelectedStationContext = createContext<SelectedStationContextType | undefined>(undefined);

export const SelectedStationProvider: FC<{children: ReactNode}> = ({children}) => {
  const [selectedStation, setSelectedStation] = useState<Station| null>(null);


  return (
    <SelectedStationContext.Provider value={{selectedStation, setSelectedStation}}>
      {children}
    </SelectedStationContext.Provider>
  )
}



export const useSelectedStationContext = (): SelectedStationContextType => {
  const context = useContext(SelectedStationContext);
  if (!context) {
    throw new Error(
      "SelectedStationContext must be used within SelectedStationProvider"
    );
  }
  return context;
};
