import { Dispatch, SetStateAction } from "react";

export type QueueContextType = {
  queueID:string;
  setQueueID: Dispatch<SetStateAction<string>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
}