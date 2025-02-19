"use client"
import { QueueContextType } from "@/types/QueueContextType";
import { createContext, ReactNode, useContext, useState } from "react";


const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [queueID, setQueueID] = useState(""); //get from localstorage or cookies
  const [token, setToken] = useState<string | null>(""); //get from localstorage or cookies
  
  return (
    <QueueContext.Provider value={{queueID, setQueueID, token, setToken}}>
      {children}
    </QueueContext.Provider>
  )
} 

export const useQueueContext = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("QueueContext must be used within QueueContextProvider");
  }
  return context;
}