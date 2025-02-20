"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { QueueContextType } from "@/types/QueueContextType";

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queueID, setQueueID] = useState<string>(""); // set an initial value for string
  const [token, setToken] = useState<string | null>(null);

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
