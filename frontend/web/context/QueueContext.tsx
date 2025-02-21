"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { QueueContextType } from "@/types/QueueContextType";
import { jwtDecode, JwtPayload } from "jwt-decode";

// Define DecodedToken using intersection type
type DecodedToken = JwtPayload & { queueNumber: number };

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queueID, setQueueID] = useState<string>(""); 
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const expiration = decodedToken.exp;

        if (expiration && expiration * 1000 < Date.now()) {
          console.warn("[QueueProvider] Token expired. Removing from local storage.");
          localStorage.removeItem("token");
          setToken(null);
        } else {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("[QueueProvider] Failed to decode token:", error);
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  }, []);

  return (
    <QueueContext.Provider value={{ queueID, setQueueID, token, setToken }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueueContext = (): QueueContextType => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueueContext must be used within a QueueProvider");
  }
  return context;
};
