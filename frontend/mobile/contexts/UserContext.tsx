import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import User from "../types/user";

type UserContextType = {
  userInfo:User | null;
  setUserInfo: Dispatch<SetStateAction<User | null>>;
  allowedRoles: string[];
  userToken: string;
  setUserToken: Dispatch<SetStateAction<string>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {

  const [userInfo, setUserInfo] = useState<User| null>(null);
  const [userToken, setUserToken] = useState("")
  const allowedRoles = ["admin", "cashier", "information"];

  return (
    <UserContext.Provider value={{userInfo, setUserInfo, allowedRoles, userToken, setUserToken}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if(!context){
    throw new Error("UserContext must be used within UserProvider");
  }
  return context;
}