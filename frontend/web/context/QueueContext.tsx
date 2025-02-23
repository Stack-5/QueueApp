"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { QueueContextType } from "@/types/QueueContextType";
import { jwtDecode, JwtPayload } from "jwt-decode";

type DecodedToken = JwtPayload & { queueNumber: number };

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const QueueProvider : React.FC<{children: ReactNode}> = ({children}) =>{
  const [queueNumber, setQueueNumber] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedQueueNumber = localStorage.getItem("queueNumber");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const expiration = decodedToken.exp;

        if (expiration && expiration < Math.floor(Date.now() / 1000)) {
          console.warn("[QueueProvider] Token expired. Removing from local storage.");
          localStorage.removeItem("token");
          localStorage.removeItem("queueNumber");
          setToken(null);
          setQueueNumber(0);
        } else {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("[QueueProvider] Failed to decode token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("queueNumber");
        setToken(null);
        setQueueNumber(0);
      }
    }

    if (storedQueueNumber) {
      setQueueNumber(Number(storedQueueNumber));
    }
  }, []);

  return (
    <QueueContext.Provider value={{ queueNumber, setQueueNumber, token, setToken }}>
      {children}
    </QueueContext.Provider>
  );
}

const useQueueContext = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueueContext must be used within a QueueProvider");
  }
  return context;
}

export { QueueProvider, useQueueContext };
