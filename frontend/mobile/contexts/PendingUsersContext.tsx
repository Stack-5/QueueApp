import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import User from "../types/user";

type PendingUsersContextType = {
  pendingUsers: User[];
  setPendingUsers: Dispatch<SetStateAction<User[]>>;
}

const PendingUsersContext = createContext<PendingUsersContextType | undefined>(undefined);

export const PendingUsersProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  return (
    <PendingUsersContext.Provider value={{pendingUsers, setPendingUsers}}>
      {children}
    </PendingUsersContext.Provider>
  )
}

export const usePedingUsersContext = (): PendingUsersContextType => {
  const context = useContext(PendingUsersContext);
  if(!context){
    throw new Error("usePendingUsersContext must be used within usePendingUsersProvider");
  }
  return context;
}