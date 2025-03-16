"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { QueueContextType } from "@/types/QueueContextType";
import { jwtDecode, JwtPayload } from "jwt-decode";

//
// Remove this in next commit

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const QueueProvider : React.FC<{children: ReactNode}> = ({children}) =>{
  const [queueID, setQueueID] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedQueueID = localStorage.getItem("queueID");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(storedToken);
        const expiration = decodedToken.exp;

        if (expiration && expiration < Math.floor(Date.now() / 1000)) {
          console.warn("[QueueProvider] Token expired. Removing from local storage.");
          localStorage.removeItem("token");
          setToken(null);
          setQueueID(null);
        } else {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("[QueueProvider] Failed to decode token:", error);
        localStorage.removeItem("token");
        setToken(null);
        setQueueID(null);
      }
    }

    if (storedQueueID) {
      setQueueID(storedQueueID);
    }
    setLoading(false);
  }, []);

  return (
    <QueueContext.Provider value={{ queueID, setQueueID, token, setToken, loading}}>
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
