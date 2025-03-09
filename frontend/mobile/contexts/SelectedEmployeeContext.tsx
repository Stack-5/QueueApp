import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  FC
} from "react";
import User from "../type/user";

type SelectedEmployeeContextType = {
  selectedEmployee: User | null;
  setSelectedEmployee: Dispatch<SetStateAction<User | null>>;
};

const SelectedEmployeeContext = createContext<
  SelectedEmployeeContextType | undefined
>(undefined);

export const SelectedEmployeeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);

  return (
    <SelectedEmployeeContext.Provider
      value={{ selectedEmployee, setSelectedEmployee }}
    >
      {children}
    </SelectedEmployeeContext.Provider>
  );
};

export const useSelectedEmployeeContext = (): SelectedEmployeeContextType => {
  const context = useContext(SelectedEmployeeContext);
  if (!context) {
    throw new Error(
      "SelectedEmployeeContext must be used within SelectedEmployeeProvider"
    );
  }

  return context;
};
