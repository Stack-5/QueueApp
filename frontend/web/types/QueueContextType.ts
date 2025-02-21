import { Dispatch, SetStateAction } from "react";

export type QueueContextType = {
  queueID: number; 
  setQueueID: Dispatch<SetStateAction<number>>; 
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
};
