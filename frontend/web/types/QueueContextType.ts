import { Dispatch, SetStateAction } from "react";

export type QueueContextType = {
  queueNumber: number;
  setQueueNumber: Dispatch<SetStateAction<number>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
};
