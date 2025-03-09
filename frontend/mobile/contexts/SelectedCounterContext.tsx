import Counter from "@type/counter";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type SelectedCounterContextType = {
  selectedCounter: Counter | null;
  setSelectedCounter: Dispatch<SetStateAction<Counter | null>>;
};

const SelectedCounterContext = createContext<
  SelectedCounterContextType | undefined
>(undefined);

export const SelectedCounterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);

  return (
    <SelectedCounterContext.Provider
      value={{ selectedCounter, setSelectedCounter }}
    >
      {children}
    </SelectedCounterContext.Provider>
  );
};

export const useSelectedCounterContext = (): SelectedCounterContextType => {
  const context = useContext(SelectedCounterContext);
  if (!context) {
    throw new Error(
      "SelectedCounterContext must be used within SelectedCounterProvider"
    );
  }

  return context;
};
