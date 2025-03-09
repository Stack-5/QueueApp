import Station from "@type/station";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";


type StationContextType = {
  stations: Station[];
  setStations: Dispatch<SetStateAction<Station[]>>;
};

// Create the context with default values
const StationContext = createContext<StationContextType | undefined>(undefined);

export const StationProvider = ({ children }: { children: ReactNode }) => {
  const [stations, setStations] = useState<Station[]>([]);

  return (
    <StationContext.Provider value={{ stations, setStations }}>
      {children}
    </StationContext.Provider>
  );
};

export const useStationContext = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error("useStations must be used within a StationProvider");
  }
  return context;
};